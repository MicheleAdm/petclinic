package victor.training.petclinic.domain;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class PetVisitDateRangeTest {

    private static final LocalDate TODAY = LocalDate.of(2026, 9, 10);
    private static final LocalDate BIRTH_DATE = LocalDate.of(2020, 3, 1);

    private final Pet pet = petBornOn(BIRTH_DATE);

    @Test
    void acceptsAVisitOnTheBirthDate() {
        assertThat(pet.visitDateProblem(BIRTH_DATE, TODAY)).isEmpty();
    }

    @Test
    void acceptsAVisitExactlyOneYearAhead() {
        assertThat(pet.visitDateProblem(LocalDate.of(2027, 9, 10), TODAY)).isEmpty();
    }

    @Test
    void acceptsAMissingDate() {
        assertThat(pet.visitDateProblem(null, TODAY)).isEmpty();
    }

    @Test
    void refusesAVisitThatPredatesThePet() {
        assertThat(pet.visitDateProblem(LocalDate.of(2020, 2, 29), TODAY))
                .hasValue("Visit date 2020-02-29 is before the pet's birth date 2020-03-01");
    }

    @Test
    void refusesTheYearNineVisitOfIssue40() {
        assertThat(pet.visitDateProblem(LocalDate.of(9, 7, 20), TODAY)).isPresent();
    }

    @Test
    void refusesAVisitMoreThanAYearAhead() {
        assertThat(pet.visitDateProblem(LocalDate.of(2027, 9, 11), TODAY))
                .hasValue("Visit date 2027-09-11 is after 2027-09-10, one year from today");
    }

    @Test
    void anUnknownBirthDateBoundsOnlyTheFuture() {
        Pet unknownAge = petBornOn(null);

        assertThat(unknownAge.visitDateProblem(LocalDate.of(1990, 1, 1), TODAY)).isEmpty();
        assertThat(unknownAge.visitDateProblem(LocalDate.of(2027, 9, 11), TODAY)).isPresent();
    }

    private static Pet petBornOn(LocalDate birthDate) {
        Pet pet = new Pet();
        pet.setBirthDate(birthDate);
        return pet;
    }
}

package victor.training.petclinic.rest;

import org.springframework.web.server.ResponseStatusException;
import victor.training.petclinic.domain.Pet;

import java.time.LocalDate;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

final class VisitDateRule {
    private VisitDateRule() {
    }

    static void requireInRange(Pet pet, LocalDate visitDate) {
        pet.visitDateProblem(visitDate, LocalDate.now()).ifPresent(problem -> {
            throw new ResponseStatusException(BAD_REQUEST, problem);
        });
    }
}

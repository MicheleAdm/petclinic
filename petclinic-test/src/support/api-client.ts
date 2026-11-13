import axios, {AxiosInstance} from 'axios';

export interface VisitDto {
  id: number;
  date: string;
  description: string;
  petId: number;
  petName?: string;
  ownerId?: number;
  ownerFirstName?: string;
  ownerLastName?: string;
}

const idFromLocation = (location: string): number => Number(location.split('/').pop());

export class ApiClient {
  private client: AxiosInstance;

  // Use 127.0.0.1 (not "localhost"): under Node 18+ "localhost" can resolve to IPv6 ::1
  // first and fail with a cryptic AggregateError when the backend listens on IPv4.
  constructor(baseUrl: string = process.env.API_BASE_URL || 'http://127.0.0.1:8080/api') {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
    });
  }

  async fetchVisits(): Promise<VisitDto[]> {
    const response = await this.client.get<VisitDto[]>('/visits');
    return response.data;
  }

  /** Issue #40's cast: Kevin McCallister and his dog Axel, born on `birthDate`. */
  async createOwnerWithDog(birthDate: string): Promise<{ownerId: number; petId: number}> {
    const owner = await this.client.post('/owners', {
      firstName: 'Kevin', lastName: 'McCallister', address: '671 Lincoln Ave', city: 'Winnetka',
      telephone: '0712345678',
    });
    const ownerId = idFromLocation(owner.headers.location);
    const pet = await this.client.post(`/owners/${ownerId}/pets`, {
      name: 'Axel', birthDate, type: {id: 2, name: 'dog'},
    });
    return {ownerId, petId: idFromLocation(pet.headers.location)};
  }

  async visitsOfPet(petId: number): Promise<VisitDto[]> {
    return (await this.fetchVisits()).filter((v) => v.petId === petId);
  }

  static sortedByDate<T extends {date: string}>(rows: T[]): T[] {
    return [...rows].sort((a, b) => a.date.localeCompare(b.date));
  }
}

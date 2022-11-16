export class PelletService {
  constructor(pelletRepo) {
    this.pelletRepo = pelletRepo;
  }

  async getConsumptions() {
    return this.pelletRepo.getConsumptions();
  }
}

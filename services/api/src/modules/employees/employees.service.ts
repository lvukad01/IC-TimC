import { Injectable } from '@nestjs/common';
import { AddEmployeeDto } from './dto/add-employee.dto';

@Injectable()
export class EmployeesService {
  getAllEmployees(salonId: string) {
    //TODO
  }

  getEmployeeById(salonId: string, employeeId: string) {
    //TODO
  }

  addEmployee(salonId: string, addEmployeeDto: AddEmployeeDto) {
    //TODO
  }

  updateEmployee(salonId: string, employeeId: string) {
    //TODO
  }

  deleteEmployee(salnId: string, employeeId: string) {
    //TODO
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { AddEmployeeDto } from './dto/add-employee.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ERROR_MESSAGES } from '@lumii/messages';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}
  getAllEmployees(salonId: string) {
    return this.prisma.employees.findMany({
      where: { salonId: salonId },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });
  }

  getEmployeeById(salonId: string, employeeId: string) {
    const employee = this.prisma.employees.findFirst({
      where: { salonId: salonId, id: employeeId },
      select: {
        id: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
    if (!employee) {
      throw new NotFoundException(ERROR_MESSAGES.EMPLOYEE_NOT_FOUND);
    }
    return employee;
  }

  addEmployee(salonId: string, addEmployeeDto: AddEmployeeDto) {
    return this.prisma.employees.create({
      data: {
        salonId: salonId,
        name: addEmployeeDto.name,
        role: addEmployeeDto.role,
        isActive: addEmployeeDto.isActive,
      },
    });
  }

  updateEmployee(
    salonId: string,
    employeeId: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.prisma.employees.update({
      where: { id: employeeId },
      data: {
        salonId: salonId,
        name: updateEmployeeDto.name,
        role: updateEmployeeDto.role,
        isActive: updateEmployeeDto.isActive,
      },
    });
  }

  async deleteEmployee(salonId: string, employeeId: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, salonId: salonId },
    });

    if (!employee)
      throw new NotFoundException(ERROR_MESSAGES.EMPLOYEE_NOT_FOUND);

    return this.prisma.employees.delete({
      where: { id: employeeId },
    });
  }
}

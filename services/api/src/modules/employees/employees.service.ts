import { Injectable, NotFoundException } from '@nestjs/common';
import { AddEmployeeDto } from './dto/add-employee.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}
  getAllEmployees(salonId: string) {
    return this.prisma.employees.findMany({
      where: { salon_id: salonId },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });
  }

  getEmployeeById(salonId: string, employeeId: string) {
    return this.prisma.employees.findFirst({
      where: { salon_id: salonId, id: employeeId },
      select: {
        id: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
  }

  addEmployee(salonId: string, addEmployeeDto: AddEmployeeDto) {
    return this.prisma.employees.create({
      data: {
        salon_id: salonId,
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
        salon_id: salonId,
        name: updateEmployeeDto.name,
        role: updateEmployeeDto.role,
        isActive: updateEmployeeDto.isActive,
      },
    });
  }

  async deleteEmployee(salonId: string, employeeId: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, salon_id: salonId },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    return this.prisma.employees.delete({
      where: { id: employeeId },
    });
  }
}

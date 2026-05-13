import { ActionResponseDto } from '@common/common';
import { ErrorMessages } from '@lumii/messages';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddEmployeeDto } from './dto/add-employee.dto';
import { AddEmployeesDto } from './dto/add-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

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

  async getEmployeeById(salonId: string, employeeId: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { salonId: salonId, id: employeeId },
      select: {
        id: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
    if (!employee)
      throw new NotFoundException(ErrorMessages.notFound('Employee'));

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

  async addEmployees(
    salonId: string,
    addEmployeesDto: AddEmployeesDto,
  ): Promise<ActionResponseDto> {
    await this.prisma.employees.createMany({
      data: addEmployeesDto.employees.map((e) => ({
        salonId: salonId,
        name: e.name,
        role: e.role,
        isActive: e.isActive,
      })),
    });

    return { message: 'Employees successfully added' };
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
      throw new NotFoundException(ErrorMessages.notFound('Employee'));

    await this.prisma.employees.delete({
      where: { id: employeeId },
    });

    return {
      id: employeeId,
      message: 'Employee deleted successfully',
    };
  }
}

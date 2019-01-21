import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  registers = [];

  constructor() { }

  addAttendee(index, attendee) {
    this.registers[index] = attendee;
  }

  removeAttendee(index) {
    this.registers.splice(index, 1);
  }

  getAllRegisters() {
    return this.registers;
  }

  setAllRegisters(registers) {
    for (var i in registers) {
      this.registers.push(registers[i]);
    }
  }
}

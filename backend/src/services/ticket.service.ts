import { TicketModel } from '../models/ticket.model';
import { Ticket } from '../types/ticket.types';

export class TicketService {
  static async getAllTickets(): Promise<Ticket[]> {
    return await TicketModel.findAll();
  }

  static async getAllTicketsIncludingDeleted(): Promise<Ticket[]> {
    return await TicketModel.findAllIncludingDeleted();
  }

  static async createTicket(ticket: Omit<Ticket, 'ticket_id'>): Promise<Ticket> {
    return await TicketModel.create(ticket);
  }

  static async getTicketById(id: number): Promise<Ticket | null> {
    return await TicketModel.findById(id);
  }

  static async deleteTicket(id: number): Promise<void> {
    return await TicketModel.remove(id);
  }

  static async restoreTicket(id: number): Promise<Ticket | null> {
    return await TicketModel.restore(id);
  }

  static async getTicketsByDate(date: string): Promise<Ticket[]> {
    return await TicketModel.findByDate(date);
  }
}

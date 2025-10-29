import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';

export class TicketController {
  static async getAllTickets(req: Request, res: Response): Promise<void> {
    try {
      const tickets = await TicketService.getAllTickets();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tickets', error });
    }
  }

  static async createTicket(req: Request, res: Response): Promise<void> {
    try {
      console.log('Creating ticket with data:', req.body);
      const newTicket = await TicketService.createTicket(req.body);
      res.status(201).json(newTicket);
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      res.status(500).json({
        message: 'Error creating ticket',
        error: error.message || error
      });
    }
  }

  static async getTicketById(req: Request, res: Response): Promise<void> {
    try {
      const ticket = await TicketService.getTicketById(parseInt(req.params.id));
      if (ticket) {
        res.status(200).json(ticket);
      } else {
        res.status(404).json({ message: 'Ticket not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching ticket', error });
    }
  }

  static async deleteTicket(req: Request, res: Response): Promise<void> {
    try {
      await TicketService.deleteTicket(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting ticket', error });
    }
  }

  static async getTicketsByDate(req: Request, res: Response): Promise<void> {
    try {
      const tickets = await TicketService.getTicketsByDate(req.params.date);
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tickets by date', error });
    }
  }
}

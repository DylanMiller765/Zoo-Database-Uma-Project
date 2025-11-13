import { Request, Response } from 'express';
import { QueryService } from '../services/query.service';

export class QueryController {
  /**
   * Report 1: Animal Health & Care Report
   */
  static async getAnimalHealthAndCare(req: Request, res: Response): Promise<void> {
    try {
      const {
        startDate,
        endDate,
        habitatStatus,
        healthStatus,
        endangerment,
        feedingCompliance,
        includeDeleted
      } = req.query;

      // Parse array parameters
      const habitatStatusArray = habitatStatus
        ? (Array.isArray(habitatStatus) ? habitatStatus as string[] : [habitatStatus as string])
        : undefined;

      const healthStatusArray = healthStatus
        ? (Array.isArray(healthStatus) ? healthStatus as string[] : [healthStatus as string])
        : undefined;

      const endangermentArray = endangerment
        ? (Array.isArray(endangerment) ? endangerment as string[] : [endangerment as string])
        : undefined;

      const data = await QueryService.getAnimalHealthAndCare({
        startDate: startDate as string,
        endDate: endDate as string,
        habitatStatus: habitatStatusArray,
        healthStatus: healthStatusArray,
        endangerment: endangermentArray,
        feedingCompliance: feedingCompliance as string,
        includeDeleted: includeDeleted === 'true'
      });

      res.status(200).json(data);
    } catch (error) {
      console.error('❌ Error fetching animal health and care report:', error);
      res.status(500).json({
        message: 'Error fetching animal health and care report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Report 2: Event Performance Report
   */
  static async getEventPerformance(req: Request, res: Response): Promise<void> {
    try {
      const {
        startDate,
        endDate,
        eventStatus,
        minCapacity,
        includeCanceled,
        includeDeleted
      } = req.query;

      // Validate required parameters
      if (!startDate || !endDate) {
        res.status(400).json({
          message: 'Start date and end date are required for Event Performance Report'
        });
        return;
      }

      const data = await QueryService.getEventPerformance({
        startDate: startDate as string,
        endDate: endDate as string,
        eventStatus: eventStatus as string,
        minCapacity: minCapacity ? parseInt(minCapacity as string) : 0,
        includeCanceled: includeCanceled === 'true',
        includeDeleted: includeDeleted === 'true'
      });

      res.status(200).json(data);
    } catch (error) {
      console.error('❌ Error fetching event performance report:', error);
      res.status(500).json({
        message: 'Error fetching event performance report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Report 3: Financial Report
   */
  static async getFinancialReport(req: Request, res: Response): Promise<void> {
    try {
      const {
        startDate,
        endDate,
        sources,
        grouping,
        includeReturns
      } = req.query;

      // Validate required parameters
      if (!startDate || !endDate) {
        res.status(400).json({
          message: 'Start date and end date are required for Financial Report'
        });
        return;
      }

      // Parse sources array
      let sourcesArray: string[] | undefined;
      if (sources) {
        sourcesArray = typeof sources === 'string'
          ? sources.split(',')
          : sources as string[];
      }

      const data = await QueryService.getFinancialReport({
        startDate: startDate as string,
        endDate: endDate as string,
        sources: sourcesArray,
        grouping: grouping as string,
        includeReturns: includeReturns === 'true'
      });

      const summary = await QueryService.getFinancialReportSummary({
        startDate: startDate as string,
        endDate: endDate as string,
        sources: sourcesArray,
        grouping: grouping as string,
        includeReturns: includeReturns === 'true'
      });

      res.status(200).json({ data, summary });
    } catch (error) {
      console.error('❌ Error fetching financial report:', error);
      res.status(500).json({
        message: 'Error fetching financial report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

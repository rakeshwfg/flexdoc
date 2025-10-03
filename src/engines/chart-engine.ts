/**
 * Chart Generation Engine
 * Converts data to beautiful charts for presentations
 */

import PptxGenJS from 'pptxgenjs';

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'bubble' | 'radar';
  title?: string;
  categories: string[];
  series: ChartSeries[];
  options?: ChartOptions;
}

export interface ChartSeries {
  name: string;
  values: number[];
  color?: string;
}

export interface ChartOptions {
  showLegend?: boolean;
  showTitle?: boolean;
  showValues?: boolean;
  show3D?: boolean;
  gridLines?: boolean;
  animation?: boolean;
  theme?: 'light' | 'dark' | 'colorful';
}

export class ChartEngine {
  /**
   * Convert table data to optimal chart type
   */
  static analyzeDataForChart(data: any): ChartData | null {
    if (!data || !data.rows || data.rows.length === 0) return null;

    const headers = data.headers || [];
    const rows = data.rows || [];
    
    // Detect numeric columns
    const numericCols = this.detectNumericColumns(rows);
    
    if (numericCols.length === 0) return null;

    // Determine best chart type based on data characteristics
    const chartType = this.determineBestChartType(headers, rows, numericCols);
    
    // Extract series data
    const series = this.extractChartSeries(headers, rows, numericCols);
    const categories = this.extractCategories(headers, rows, numericCols);

    return {
      type: chartType,
      title: this.generateChartTitle(headers),
      categories,
      series,
      options: {
        showLegend: series.length > 1,
        showTitle: true,
        showValues: rows.length <= 10,
        gridLines: true,
        animation: true,
        theme: 'colorful'
      }
    };
  }

  /**
   * Detect numeric columns in table data
   */
  private static detectNumericColumns(rows: any[][]): number[] {
    if (rows.length === 0) return [];
    
    const numericCols: number[] = [];
    const firstRow = rows[0];
    
    for (let col = 0; col < firstRow.length; col++) {
      const isNumeric = rows.every(row => {
        const value = row[col];
        return !isNaN(parseFloat(value)) && isFinite(value);
      });
      
      if (isNumeric) numericCols.push(col);
    }
    
    return numericCols;
  }

  /**
   * Determine best chart type for data
   */
  private static determineBestChartType(
    headers: string[],
    rows: any[][],
    numericCols: number[]
  ): ChartData['type'] {
    const numRows = rows.length;
    const numNumericCols = numericCols.length;
    
    // Time series data -> Line chart
    if (this.isTimeSeries(headers, rows)) {
      return 'line';
    }
    
    // Single numeric column with few categories -> Pie chart
    if (numNumericCols === 1 && numRows <= 8) {
      return 'pie';
    }
    
    // Multiple numeric columns -> Bar chart for comparison
    if (numNumericCols > 1 && numRows <= 12) {
      return 'bar';
    }
    
    // Many data points -> Area chart
    if (numRows > 20) {
      return 'area';
    }
    
    // Correlation data -> Scatter plot
    if (numNumericCols === 2 && this.looksLikeCorrelation(rows, numericCols)) {
      return 'scatter';
    }
    
    // Default to bar chart
    return 'bar';
  }

  /**
   * Check if data appears to be time series
   */
  private static isTimeSeries(headers: string[], rows: any[][]): boolean {
    const timePatterns = [/\d{4}/, /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i, /q[1-4]/i, /\d{1,2}\/\d{1,2}/];
    
    // Check headers
    const hasTimeHeader = headers.some(h => 
      timePatterns.some(pattern => pattern.test(h))
    );
    
    if (hasTimeHeader) return true;
    
    // Check first column
    if (rows.length > 0) {
      const firstCol = rows.map(r => r[0]);
      const hasTimeData = firstCol.every(val => 
        timePatterns.some(pattern => pattern.test(String(val)))
      );
      return hasTimeData;
    }
    
    return false;
  }

  /**
   * Check if data looks like correlation (for scatter plot)
   */
  private static looksLikeCorrelation(rows: any[][], numericCols: number[]): boolean {
    if (numericCols.length !== 2) return false;
    
    const col1 = rows.map(r => parseFloat(r[numericCols[0]]));
    const col2 = rows.map(r => parseFloat(r[numericCols[1]]));
    
    // Simple correlation check - if values seem to have a relationship
    const correlation = this.calculateCorrelation(col1, col2);
    return Math.abs(correlation) > 0.3;
  }

  /**
   * Calculate correlation coefficient
   */
  private static calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
    const sumX2 = x.reduce((total, xi) => total + xi * xi, 0);
    const sumY2 = y.reduce((total, yi) => total + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Extract chart series from table data
   */
  private static extractChartSeries(
    headers: string[],
    rows: any[][],
    numericCols: number[]
  ): ChartSeries[] {
    const series: ChartSeries[] = [];
    const colors = this.getChartColors();
    
    numericCols.forEach((col, index) => {
      series.push({
        name: headers[col] || `Series ${index + 1}`,
        values: rows.map(row => parseFloat(row[col]) || 0),
        color: colors[index % colors.length]
      });
    });
    
    return series;
  }

  /**
   * Extract categories for chart
   */
  private static extractCategories(
    headers: string[],
    rows: any[][],
    numericCols: number[]
  ): string[] {
    // Find non-numeric column (usually first)
    const categoryCol = headers.findIndex((_, index) => !numericCols.includes(index));
    
    if (categoryCol >= 0) {
      return rows.map(row => String(row[categoryCol]));
    }
    
    // Fallback to row numbers
    return rows.map((_, index) => `Item ${index + 1}`);
  }

  /**
   * Generate chart title from headers
   */
  private static generateChartTitle(headers: string[]): string {
    // Try to create meaningful title
    const filtered = headers.filter(h => 
      !['id', 'index', '#'].includes(h.toLowerCase())
    );
    
    if (filtered.length > 0) {
      return filtered.join(' vs ');
    }
    
    return 'Data Analysis';
  }

  /**
   * Get professional chart colors
   */
  private static getChartColors(): string[] {
    return [
      '4472C4', // Blue
      'ED7D31', // Orange
      'A5A5A5', // Gray
      'FFC000', // Yellow
      '5B9BD5', // Light Blue
      '70AD47', // Green
      '264478', // Dark Blue
      '9E480E', // Brown
      '636363', // Dark Gray
      '997300'  // Dark Yellow
    ];
  }

  /**
   * Create chart object for PPTX
   */
  static createPptxChart(slide: any, chartData: ChartData, position: any): void {
    const chartOptions: any = {
      x: position.x,
      y: position.y,
      w: position.w,
      h: position.h,
      
      showLegend: chartData.options?.showLegend,
      legendPos: 'r',
      showTitle: chartData.options?.showTitle,
      title: chartData.title,
      
      showCatAxisTitle: false,
      showValAxisTitle: false,
      
      catGridLine: { style: 'none' },
      valGridLine: chartData.options?.gridLines ? { style: 'major' } : { style: 'none' },
      
      chartColors: chartData.series.map(s => s.color).filter(Boolean),
      
      showValue: chartData.options?.showValues,
      dataLabelPosition: 'outEnd',
      dataLabelFormatCode: '#,##0',
      
      barDir: 'bar',
      barGapWidthPct: 150,
      
      lineDataSymbol: 'circle',
      lineDataSymbolSize: 6,
      
      ...this.getChartTypeSpecificOptions(chartData.type)
    };

    // Prepare data for pptxgenjs
    const data = chartData.series.map(series => ({
      name: series.name,
      labels: chartData.categories,
      values: series.values
    }));

    // Add chart to slide
    slide.addChart(this.mapChartType(chartData.type), data, chartOptions);
  }

  /**
   * Get chart type specific options
   */
  private static getChartTypeSpecificOptions(type: ChartData['type']): any {
    switch (type) {
      case 'pie':
      case 'doughnut':
        return {
          holeSize: type === 'doughnut' ? 50 : 0,
          showLabel: true,
          showPercent: true,
          showLegend: true,
          legendPos: 'b'
        };
      
      case 'line':
      case 'area':
        return {
          lineSmooth: true,
          lineSize: 2,
          fill: type === 'area'
        };
      
      case 'scatter':
      case 'bubble':
        return {
          lineSize: 0,
          showLabel: false
        };
      
      default:
        return {};
    }
  }

  /**
   * Map chart type to pptxgenjs type
   */
  private static mapChartType(type: ChartData['type']): any {
    const mapping = {
      'bar': this.pptx.ChartType.bar,
      'line': this.pptx.ChartType.line,
      'pie': this.pptx.ChartType.pie,
      'doughnut': this.pptx.ChartType.doughnut,
      'area': this.pptx.ChartType.area,
      'scatter': this.pptx.ChartType.scatter,
      'bubble': this.pptx.ChartType.bubble,
      'radar': this.pptx.ChartType.radar
    };
    
    return mapping[type] || this.pptx.ChartType.bar;
  }

  // Reference to pptx instance
  private static pptx = new PptxGenJS();
}

/**
 * Data Visualization Factory
 */
export class DataVisualizationFactory {
  /**
   * Create infographic from data
   */
  static createInfographic(data: any, theme: any): any {
    // Analyze data type
    const dataType = this.analyzeDataType(data);
    
    switch (dataType) {
      case 'statistics':
        return this.createStatisticsInfographic(data, theme);
      case 'process':
        return this.createProcessDiagram(data, theme);
      case 'comparison':
        return this.createComparisonInfographic(data, theme);
      case 'timeline':
        return this.createTimelineInfographic(data, theme);
      default:
        return this.createDefaultVisualization(data, theme);
    }
  }

  private static analyzeDataType(data: any): string {
    // Implement data type detection logic
    return 'default';
  }

  private static createStatisticsInfographic(data: any, theme: any): any {
    return {
      type: 'infographic',
      layout: 'statistics',
      elements: [
        // Create visual elements for statistics
      ]
    };
  }

  private static createProcessDiagram(data: any, theme: any): any {
    return {
      type: 'diagram',
      layout: 'process',
      elements: [
        // Create process flow elements
      ]
    };
  }

  private static createComparisonInfographic(data: any, theme: any): any {
    return {
      type: 'infographic',
      layout: 'comparison',
      elements: [
        // Create comparison visual elements
      ]
    };
  }

  private static createTimelineInfographic(data: any, theme: any): any {
    return {
      type: 'timeline',
      layout: 'horizontal',
      elements: [
        // Create timeline elements
      ]
    };
  }

  private static createDefaultVisualization(data: any, theme: any): any {
    return {
      type: 'visualization',
      layout: 'default',
      elements: []
    };
  }
}

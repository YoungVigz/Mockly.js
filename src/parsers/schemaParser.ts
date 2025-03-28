import { FieldProcessor } from "../processors/fieldProcessor";
import { Model, Field, ProcessedSchema, ProcessedModel } from "../types/schema";

export class SchemaParser {
  private rawSchema: any;
  private parsedSchema: ProcessedSchema = { options: {}, models: {} };

  constructor(rawSchema: any) {
    this.rawSchema = rawSchema;
  }

  parse(): ProcessedSchema { 
    this.processOptions();
    this.processModels();
    return this.parsedSchema;
  }

  private processOptions() {
    this.parsedSchema.options = this.rawSchema.options;
  }

  private processModels(): void {    
    for (const [modelName, modelDef] of Object.entries(this.rawSchema.models)) {
      this.parsedSchema.models[modelName] = this.processModel(
        modelDef as Model
      );
    }
  }

  private processModel(modelDef: Model): ProcessedModel {
    return {
      ...modelDef,
      fields: Object.fromEntries(
        Object.entries(modelDef.fields).map(([fieldName, fieldDef]) => [
          fieldName,
          FieldProcessor.process(fieldDef as Field)
        ])
    )};
  }
}
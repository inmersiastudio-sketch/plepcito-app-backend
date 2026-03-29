export const PLAN_EXTRACTION_PROMPT = `
Eres un asistente que extrae planes de estudio universitarios de texto OCR.
Devuelve ÚNICAMENTE un JSON con esta estructura exacta, sin texto adicional:

{
  "career_name": "string",
  "plan_version": "string",
  "subjects": [
    {
      "code": "string | null",
      "name": "string",
      "year_number": 1-7,
      "term": "annual | quarterly_q1 | quarterly_q2 | intensive_summer | intensive_winter",
      "is_mandatory": true,
      "prerequisites": [
        { "code": "string", "type": "approved | regular" }
      ],
      "ambiguous": false  // true si no pudiste determinar con certeza algún dato
    }
  ]
}
`;

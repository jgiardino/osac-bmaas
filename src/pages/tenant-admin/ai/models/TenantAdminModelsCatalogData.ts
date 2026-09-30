export type OdhCatalogCategory =
  | 'All models'
  | 'Red Hat AI – validated models'
  | 'Red Hat AI models'
  | 'Other models';

export type OdhCatalogModel = {
  id: string;
  name: string;
  description: string;
  provider: string;
  tasks: string[];
  validatedTasks?: string[];
  isValidated: boolean;
  isRedHat: boolean;
  category: Exclude<OdhCatalogCategory, 'All models'>;
  license: string;
  language: string;
  tensorType?: string;
};

export const ODH_CATALOG_TASKS = [
  'Text-to-text',
  'Text generation',
  'Text embedding',
  'Image-text-to-text',
  'Tool calling',
];

export const ODH_CATALOG_PROVIDERS = [
  'Apertus',
  'DeepSeek',
  'Google',
  'Mistral AI',
  'OpenAI',
  'Red Hat',
];

export const ODH_CATALOG_LICENSES = ['apache-2.0', 'mit', 'gemma'];

export const ODH_CATALOG_LANGUAGES = ['English', 'Multilingual'];

export const ODH_CATALOG_TENSOR_TYPES = ['BF16', 'FP8', 'MXFP4'];

export const odhCatalogModels: OdhCatalogModel[] = [
  {
    id: 'apertus-8b-instruct-2509-fp8-dynamic',
    name: 'Apertus-8B-Instruct-2509-FP8-dynamic',
    description: 'A multilingual instruction model with support for long-context text generation.',
    provider: 'Apertus',
    tasks: ['Text-to-text', 'Text generation', 'Tool calling'],
    validatedTasks: ['Text generation', 'Tool calling'],
    isValidated: true,
    isRedHat: false,
    category: 'Red Hat AI – validated models',
    license: 'apache-2.0',
    language: 'Multilingual',
    tensorType: 'FP8',
  },
  {
    id: 'deepseek-r1-0528-quantized-w4a16',
    name: 'DeepSeek-R1-0528-quantized.w4a16',
    description: 'Quantized DeepSeek reasoning model for local inference.',
    provider: 'DeepSeek',
    tasks: ['Text-to-text', 'Text generation'],
    validatedTasks: ['Text generation'],
    isValidated: true,
    isRedHat: false,
    category: 'Red Hat AI – validated models',
    license: 'mit',
    language: 'English',
    tensorType: 'FP8',
  },
  {
    id: 'devstral-small-2-24b-instruct-2512',
    name: 'Devstral-Small-2-24B-Instruct-2512',
    description: 'An instruction model tuned for software engineering tasks.',
    provider: 'Mistral AI',
    tasks: ['Text-to-text', 'Text generation'],
    validatedTasks: ['Text generation'],
    isValidated: true,
    isRedHat: false,
    category: 'Red Hat AI – validated models',
    license: 'apache-2.0',
    language: 'English',
    tensorType: 'FP8',
  },
  {
    id: 'diffusiongemma-26b-a4b-it-fp8-dynamic',
    name: 'diffusiongemma-26B-A4B-it-FP8-dynamic',
    description: 'An instruction-tuned image generation model.',
    provider: 'Google',
    tasks: ['Image-text-to-text', 'Text generation'],
    validatedTasks: ['Text generation'],
    isValidated: true,
    isRedHat: false,
    category: 'Red Hat AI – validated models',
    license: 'gemma',
    language: 'English',
    tensorType: 'FP8',
  },
  {
    id: 'granite-3.1-8b-lab-v1',
    name: 'granite-3.1-8b-lab-v1',
    description: 'Version 1 of the Granite 3.1 model for inference serving.',
    provider: 'Red Hat',
    tasks: ['Text generation'],
    isValidated: false,
    isRedHat: true,
    category: 'Red Hat AI models',
    license: 'apache-2.0',
    language: 'English',
  },
  {
    id: 'granite-7b-redhat-lab',
    name: 'granite-7b-redhat-lab',
    description: 'Granite model for inference serving, an instruction-tuned LAB model built via InstructLab.',
    provider: 'Red Hat',
    tasks: ['Text generation'],
    isValidated: false,
    isRedHat: true,
    category: 'Red Hat AI models',
    license: 'apache-2.0',
    language: 'English',
  },
  {
    id: 'granite-8b-code-base',
    name: 'granite-8b-code-base',
    description: 'Granite code model for inference serving, trained on 116 programming languages.',
    provider: 'Red Hat',
    tasks: ['Text generation'],
    isValidated: false,
    isRedHat: true,
    category: 'Red Hat AI models',
    license: 'apache-2.0',
    language: 'English',
  },
  {
    id: 'granite-8b-code-instruct',
    name: 'granite-8b-code-instruct',
    description: 'LAB fine-tuned Granite code model for inference serving.',
    provider: 'Red Hat',
    tasks: ['Text generation', 'Tool calling'],
    isValidated: false,
    isRedHat: true,
    category: 'Red Hat AI models',
    license: 'apache-2.0',
    language: 'English',
  },
  {
    id: 'gemma-4-26b-a4b-it',
    name: 'gemma-4-26B-A4B-it',
    description: 'Google Gemma open model for image and text tasks.',
    provider: 'Google',
    tasks: ['Image-text-to-text', 'Text generation'],
    isValidated: false,
    isRedHat: false,
    category: 'Other models',
    license: 'gemma',
    language: 'English',
    tensorType: 'FP8',
  },
  {
    id: 'gemma-4-31b-it',
    name: 'gemma-4-31B-it',
    description: 'Google Gemma open model for text generation.',
    provider: 'Google',
    tasks: ['Text generation'],
    isValidated: false,
    isRedHat: false,
    category: 'Other models',
    license: 'gemma',
    language: 'English',
    tensorType: 'BF16',
  },
  {
    id: 'gpt-oss-20b',
    name: 'gpt-oss-20b',
    description: 'OpenAI open-weight reasoning model for local inference and specialized use cases.',
    provider: 'OpenAI',
    tasks: ['Text generation', 'Tool calling'],
    isValidated: false,
    isRedHat: false,
    category: 'Other models',
    license: 'apache-2.0',
    language: 'English',
    tensorType: 'MXFP4',
  },
  {
    id: 'gpt-oss-120b',
    name: 'gpt-oss-120b',
    description: 'OpenAI open-weight reasoning model for complex tasks and local deployment.',
    provider: 'OpenAI',
    tasks: ['Text generation', 'Tool calling'],
    isValidated: false,
    isRedHat: false,
    category: 'Other models',
    license: 'apache-2.0',
    language: 'English',
    tensorType: 'MXFP4',
  },
  {
    id: 'prometheus-8x7b-v2-0',
    name: 'RedHatAI/prometheus-8x7b-v2-0',
    description: 'Prometheus 2 is an alternative of GPT-4 evaluation when doing fine-grained evaluation of any LLM.',
    provider: 'Red Hat',
    tasks: ['Text generation'],
    isValidated: false,
    isRedHat: true,
    category: 'Red Hat AI models',
    license: 'apache-2.0',
    language: 'English',
  },
];

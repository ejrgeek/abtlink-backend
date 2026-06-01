const swaggerJsdoc = require("swagger-jsdoc");
const env = require("./env");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AbtLink API",
      version: "1.0.0",
      description:
        "Documentacao da API do AbtLink para autenticacao, links curtos, QR Code e redirecionamento.",
    },
    servers: [
      {
        url: env.shortDomain,
        description: "Servidor configurado em SHORT_DOMAIN",
      },
    ],
    tags: [
      { name: "Saude", description: "Rotas para verificar se a API esta online." },
      { name: "Autenticacao", description: "Cadastro, login e usuario autenticado." },
      { name: "Admin", description: "Administracao de usuarios, links, planos e indicadores." },
      { name: "Links", description: "Criacao e listagem de links encurtados." },
      { name: "Planos", description: "Planos modelados sem pagamento real." },
      { name: "Redirecionamento", description: "Acesso publico aos links curtos." },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Mensagem de erro." },
            details: { type: "object", nullable: true },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Joao Benicio" },
            email: { type: "string", format: "email", example: "joao@example.com" },
            username: { type: "string", example: "joao-benicio" },
            role: { type: "string", example: "CUSTOMER" },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
            token: { type: "string", example: "jwt.token.aqui" },
          },
        },
        QRCode: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            imageBase64: {
              type: "string",
              example: "data:image/png;base64,iVBORw0KGgo...",
            },
            format: { type: "string", example: "png" },
            size: { type: "integer", example: 300 },
            foregroundColor: { type: "string", example: "#000000" },
            backgroundColor: { type: "string", example: "#ffffff" },
          },
        },
        Link: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            originalUrl: { type: "string", example: "https://loja.example.com" },
            domain: { type: "string", example: "http://localhost:3000" },
            slug: { type: "string", example: "minha-loja" },
            shortUrl: { type: "string", example: "http://localhost:3000/joao/minha-loja" },
            title: { type: "string", nullable: true, example: "Minha loja" },
            description: { type: "string", nullable: true },
            status: { type: "string", example: "ACTIVE" },
            clickCount: { type: "integer", example: 0 },
            qrCode: { $ref: "#/components/schemas/QRCode" },
          },
        },
        Plan: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Gratuito" },
            monthlyPriceCents: { type: "integer", example: 0 },
            annualPriceCents: { type: "integer", example: 0 },
            linkLimit: { type: "integer", example: 5 },
            qrCodeLimit: { type: "integer", example: 5 },
            customDomainLimit: { type: "integer", example: 0 },
            analyticsRetentionDays: { type: "integer", example: 7 },
            isActive: { type: "boolean", example: true },
          },
        },
        PlanInput: {
          type: "object",
          properties: {
            name: { type: "string", example: "Profissional" },
            monthlyPriceCents: { type: "integer", example: 2990 },
            annualPriceCents: { type: "integer", example: 29900 },
            monthlyDiscountPercent: { type: "integer", example: 0 },
            annualDiscountPercent: { type: "integer", example: 15 },
            linkLimit: { type: "integer", example: 100 },
            qrCodeLimit: { type: "integer", example: 100 },
            customDomainLimit: { type: "integer", example: 1 },
            analyticsRetentionDays: { type: "integer", example: 90 },
            isActive: { type: "boolean", example: true },
          },
        },
      },
    },
  },
  apis: ["./src/app.js", "./src/routes/*.js"],
});

module.exports = swaggerSpec;

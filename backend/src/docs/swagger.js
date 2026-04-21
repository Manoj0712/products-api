export const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "SuperLabs Product Service API",
    version: "1.0.0",
    description: "Product listing, detail, and admin management APIs."
  },
  servers: [
    {
      url: "http://localhost:5001",
      description: "Local development server"
    }
  ],
  components: {
    schemas: {
      Review: {
        type: "object",
        properties: {
          user: { type: "string" },
          rating: { type: "number" },
          comment: { type: "string" }
        }
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          currency: { type: "string" },
          sku: { type: "string" },
          images: {
            type: "array",
            items: { type: "string" }
          },
          availability: { type: "string" },
          category: { type: "string" },
          brand: { type: "string" },
          specifications: { type: "object" },
          reviews: {
            type: "array",
            items: { $ref: "#/components/schemas/Review" }
          }
        }
      },
      ProductListResponse: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Product" }
          },
          meta: {
            type: "object",
            properties: {
              total: { type: "number" },
              page: { type: "number" },
              limit: { type: "number" },
              totalPages: { type: "number" }
            }
          }
        }
      },
      ProductInput: {
        type: "object",
        required: ["name", "description", "price", "sku"],
        properties: {
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          currency: { type: "string" },
          sku: { type: "string" },
          images: {
            type: "array",
            items: { type: "string" }
          },
          availability: { type: "string" },
          category: { type: "string" },
          brand: { type: "string" },
          specifications: { type: "object" },
          reviews: {
            type: "array",
            items: { $ref: "#/components/schemas/Review" }
          }
        }
      }
    }
  }
};

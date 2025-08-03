export function generateSQL(schema: Record<string, string>): string {
  let sql = `CREATE TABLE items (\n  id SERIAL PRIMARY KEY,\n`;
  Object.entries(schema).forEach(([key, type]) => {
    if (key !== "id") {
      sql += `  ${key} ${mapToSQLType(type)},\n`;
    }
  });
  sql = sql.slice(0, -2) + "\n);";
  return sql;
}

function mapToSQLType(type: string): string {
  switch (type.toLowerCase()) {
    case "string":
      return "TEXT";
    case "number":
      return "INTEGER";
    case "boolean":
      return "BOOLEAN";
    case "date":
      return "TIMESTAMP";
    default:
      return "TEXT";
  }
}

export function generateModel(schema: Record<string, string>): string {
  const fields = Object.keys(schema)
    .map((key) => `  ${key}: null`)
    .join(",\n");
  return `module.exports = {\n${fields}\n};`;
}

export function generateRoutes(): string {
  return `const express = require('express');
const router = express.Router();
const service = require('./service');

router.get('/items', async (req, res) => {
  try {
    const items = await service.getAll();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/items/:id', async (req, res) => {
  try {
    const item = await service.getOne(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/items', async (req, res) => {
  try {
    const item = await service.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/items/:id', async (req, res) => {
  try {
    const item = await service.update(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/items/:id', async (req, res) => {
  try {
    const deleted = await service.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;`;
}

export function generateService(schema: Record<string, string>): string {
  const fields = Object.keys(schema).filter((key) => key !== "id");
  const insertFields = fields.join(", ");
  const insertPlaceholders = fields.map((_, i) => `$${i + 1}`).join(", ");
  const updateFields = fields
    .map((field, i) => `${field} = $${i + 2}`)
    .join(", ");

  return `const { Pool } = require('pg');
const dbClient = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = {
  getAll: async () => {
    const result = await dbClient.query('SELECT * FROM items ORDER BY id');
    return result.rows;
  },

  getOne: async (id) => {
    const result = await dbClient.query('SELECT * FROM items WHERE id = $1', [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const values = [${fields.map((field) => `data.${field}`).join(", ")}];
    const result = await dbClient.query(
      'INSERT INTO items (${insertFields}) VALUES (${insertPlaceholders}) RETURNING *',
      values
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const values = [id, ${fields.map((field) => `data.${field}`).join(", ")}];
    const result = await dbClient.query(
      'UPDATE items SET ${updateFields} WHERE id = $1 RETURNING *',
      values
    );
    return result.rows[0];
  },

  remove: async (id) => {
    const result = await dbClient.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};`;
}

import pool from '../db/dbConnector'
import cfg from '../config'
import Region from '../types/Region'

type GetParams = {
  id?: number;
  path?: string;
}

type AddParams = {
  name: string;
  path: string;
}

type UpdateParams = {
  id: number;
  name?: string;
  path?: string;
}

type DeleteParams = {
  id: number;
}

class RegionRepository {
  public async getAll(): Promise<Region[]> {
    try {
      const client = await pool.connect()

      const queryStatement = `SELECT * FROM ${cfg.dbTableName} ORDER BY path;`
      const { rows } = await client.query(queryStatement)

      client.release()

      return rows
    } catch(e) {
      throw new Error(e)
    }
  }

  public async get(params: GetParams): Promise<Region> {
    try {
      const client = await pool.connect()

      const queryStatement = params.id ?
        `SELECT * FROM ${cfg.dbTableName} WHERE id = ${params.id};`
        :
        `SELECT * FROM ${cfg.dbTableName} WHERE path = '${params.path}';`
      const { rows } = await client.query(queryStatement)

      client.release()

      return rows[0]
    } catch(e) {
      throw new Error(e)
    }
  }

  public async add(params: AddParams): Promise<Region> {
    try {
      const client = await pool.connect()

      const queryStatement = `INSERT INTO ${cfg.dbTableName} (name, path) VALUES ('${params.name}', '${params.path}') RETURNING *;`
      const { rows } = await client.query(queryStatement)

      client.release()

      return rows[0]
    } catch(e) {
      throw new Error(e)
    }
  }

  public async update(params: UpdateParams): Promise<void> {
    try {
      const client = await pool.connect()

      if (params.name !== undefined) {
        const queryStatement = `UPDATE ${cfg.dbTableName} set name = '${params.name}' WHERE id = ${params.id};`
        await client.query(queryStatement)
      }
      if (params.path) {
        const getCurrentPathStatement = `SELECT path FROM ${cfg.dbTableName} WHERE id = ${params.id};`
        const { rows } = await client.query(getCurrentPathStatement)

        const currentPath = rows[0].path

        if (currentPath !== params.path) {
          // move target node
          const queryStatement = `UPDATE ${cfg.dbTableName} set path = '${params.path}' WHERE path = '${currentPath}';`
          await client.query(queryStatement)

          // attach children nodes to node with updated path
          const childrenQueryStatement = `UPDATE ${cfg.dbTableName} set path = '${params.path}' || subpath(path, nlevel('${currentPath}')) WHERE path <@ '${currentPath}';`
          await client.query(childrenQueryStatement)
        }
      }

      client.release()
    } catch(e) {
      throw new Error(e)
    }
  }

  public async delete(params: DeleteParams): Promise<void> {
    try {
      const client = await pool.connect()

      const getCurrentPathStatement = `SELECT path FROM ${cfg.dbTableName} WHERE id = ${params.id};`
      const { rows: pathFindRows } = await client.query(getCurrentPathStatement)

      const currentPath = pathFindRows[0].path

      const queryStatement = `DELETE FROM ${cfg.dbTableName} WHERE path <@ '${currentPath}';`
      await client.query(queryStatement)

      client.release()
    } catch(e) {
      throw new Error(e)
    }
  } 
}

export default RegionRepository
import pool from '../db/dbConnector'
import cfg from '../config'
import Region from '../types/Region'

type GetParams = {
  id?: number
  path?: string
}

type AddParams = {
  name: string
  path: string
}

type UpdateParams = {
  id: number
  name?: string
  path?: string
}

type DeleteParams = {
  id: number
}

class RegionRepository {
  public async getAll(): Promise<Region[]> {
    const queryStatement = `SELECT * FROM ${cfg.dbTableName} ORDER BY path;`
    const { rows } = await pool.query(queryStatement)

    return rows
  }

  public async get(params: GetParams): Promise<Region> {
    const queryStatement = params.id
      ? `SELECT * FROM ${cfg.dbTableName} WHERE id = $1;`
      : `SELECT * FROM ${cfg.dbTableName} WHERE path = $1;`
    const queryValues = [params.id || params.path]
    const { rows } = await pool.query(queryStatement, queryValues)

    return rows[0]
  }

  public async add(params: AddParams): Promise<Region> {
    const queryStatement = `INSERT INTO ${cfg.dbTableName} (name, path) VALUES ($1, $2) RETURNING *;`
    const queryValues = [params.name, params.path]
    const { rows } = await pool.query(queryStatement, queryValues)

    return rows[0]
  }

  public async update(params: UpdateParams): Promise<void> {
    if (params.name !== undefined) {
      const queryStatement = `UPDATE ${cfg.dbTableName} set name = $1 WHERE id = $2;`
      const queryValues = [params.name, params.id]
      await pool.query(queryStatement, queryValues)
    }
    if (params.path) {
      const getCurrentPathStatement = `SELECT path FROM ${cfg.dbTableName} WHERE id = $1;`
      const queryValues = [params.id]
      const { rows } = await pool.query(getCurrentPathStatement, queryValues)

      const currentPath = rows[0].path

      if (currentPath !== params.path) {
        // TODO -> figure out how to do it via single operation
        // move target node
        const targetNodeQueryStatement = `UPDATE ${cfg.dbTableName} set path = $1 WHERE path = $2;`
        const targetNodeQueryValues = [params.path, currentPath]
        await pool.query(targetNodeQueryStatement, targetNodeQueryValues)

        // attach children nodes to node with updated path
        const childrenNodesQueryStatement = `UPDATE ${cfg.dbTableName} set path = $1 || subpath(path, nlevel($2)) WHERE path <@ $2;`
        const childrenNodesQueryValues = [params.path, currentPath]
        await pool.query(childrenNodesQueryStatement, childrenNodesQueryValues)
      }
    }
  }

  public async delete(params: DeleteParams): Promise<void> {
    const getCurrentPathStatement = `SELECT path FROM ${cfg.dbTableName} WHERE id = $1;`
    const getCurrentPathQueryValues = [params.id]
    const { rows: pathFindRows } = await pool.query(getCurrentPathStatement, getCurrentPathQueryValues)

    const currentPath = pathFindRows[0].path

    const queryStatement = `DELETE FROM ${cfg.dbTableName} WHERE path <@ $1;`
    const queryValues = [currentPath]
    await pool.query(queryStatement, queryValues)
  }
}

export default RegionRepository

"use client"

import axios from "axios"

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
})

function shouldLog() {
  return process.env.NODE_ENV !== "production"
}

function pickErrorMessage(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined
  if (!("error" in value)) return undefined
  const message = (value as { error?: unknown }).error
  return typeof message === "string" && message.trim() ? message : undefined
}

api.interceptors.response.use(
  (res) => {
    if (shouldLog()) {
      const method = res.config.method?.toUpperCase() ?? "GET"
      const url = res.config.url ?? ""
      console.log(`[api] ${method} ${url} → ${res.status}`, res.data)
    }
    return res
  },
  (error) => {
    if (shouldLog()) {
      const method = error?.config?.method?.toUpperCase?.() ?? "UNKNOWN"
      const url = error?.config?.url ?? ""
      const status = error?.response?.status
      const payload = error?.response?.data
      console.log(
        `[api] ${method} ${url} → ${typeof status === "number" ? status : "ERR"}`,
        payload ?? error,
      )
    }
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(err: unknown): string {
  if (!axios.isAxiosError(err)) {
    return err instanceof Error ? err.message : "Unknown error"
  }

  const fromPayload = pickErrorMessage(err.response?.data)
  if (fromPayload) return fromPayload

  if (typeof err.message === "string" && err.message.trim()) return err.message

  return `Request failed${typeof err.response?.status === "number" ? ` (${err.response.status})` : ""}.`
}


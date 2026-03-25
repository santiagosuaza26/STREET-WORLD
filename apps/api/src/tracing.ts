import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";
import * as dotenv from "dotenv";

dotenv.config();

function asBool(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

const tracingEnabled = asBool(process.env.OTEL_ENABLED, true);

if (tracingEnabled) {
  if (asBool(process.env.OTEL_DEBUG, false)) {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
  }

  const traceExporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ?? "http://localhost:4318/v1/traces",
  });

  const sdk = new NodeSDK({
    serviceName: process.env.OTEL_SERVICE_NAME ?? "street-world-api",
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  try {
    sdk.start();
  } catch (error: unknown) {
    console.error("OpenTelemetry failed to start", error);
  }

  const shutdown = () => {
    void sdk
      .shutdown()
      .catch((error: unknown) => {
        console.error("OpenTelemetry failed to shutdown", error);
      })
      .finally(() => {
        process.exit(0);
      });
  };

  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}
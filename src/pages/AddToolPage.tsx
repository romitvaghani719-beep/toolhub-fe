import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createToolSchema, type CreateToolInput } from "@toolhub/shared";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateTool, useTool, useUpdateTool } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Upload, FileJson, Check, ArrowRight, ArrowLeft } from "lucide-react";

const CATEGORIES = ["chat", "code", "image", "writing", "audio", "auto", "data", "search"];
const STEPS = ["Basics", "Features", "Technical", "Business", "Review"];

function splitByComma(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitByLine(value: string) {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseImportedTool(rawText: string): Partial<CreateToolInput> | null {
  const parsed = JSON.parse(rawText);
  const payload = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!payload || typeof payload !== "object") return null;

  const source = payload as Record<string, unknown>;
  const getText = (...keys: string[]) => {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === "string") return value;
    }
    return undefined;
  };
  const getBool = (...keys: string[]) => {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === "boolean") return value;
    }
    return undefined;
  };
  const getNum = (...keys: string[]) => {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === "number" && Number.isFinite(value)) return value;
    }
    return undefined;
  };
  const getArr = (...keys: string[]) => {
    for (const key of keys) {
      const value = source[key];
      if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
    }
    return undefined;
  };

  return {
    name: getText("name"),
    description: getText("description"),
    website_url: getText("website_url", "website"),
    category: (getText("category") as CreateToolInput["category"]) ?? "chat",
    image_url: getText("image_url"),
    tags: getArr("tags"),
    pricing: getText("pricing"),
    automation: getText("automation"),
    community: getText("community"),
    models: getArr("models"),
    features: getArr("features"),
    ai_capabilities: getArr("ai_capabilities", "aiCapabilities"),
    use_cases: getArr("use_cases", "useCases"),
    api_available: getBool("api_available", "apiAvailable"),
    free_plan: getBool("free_plan", "freePlan"),
    open_source: getBool("open_source", "openSource"),
    featured: getBool("featured"),
    votes: getNum("votes"),
    logo_color: getText("logo_color", "logoColor"),
  };
}

export default function AddToolPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const createTool = useCreateTool();
  const updateTool = useUpdateTool(id ?? "");
  const { data: existing } = useTool(id ?? "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<z.input<typeof createToolSchema>>({
    resolver: zodResolver(createToolSchema),
    defaultValues: {
      category: "chat",
      tags: [],
      models: [],
      features: [],
      ai_capabilities: [],
      use_cases: [],
      api_available: true,
      free_plan: true,
      open_source: false,
      featured: false,
      votes: 0,
    },
  });

  const [step, setStep] = useState(0);
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importError, setImportError] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [modelsText, setModelsText] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [capabilitiesText, setCapabilitiesText] = useState("");
  const [useCasesText, setUseCasesText] = useState("");
  const imageUrl = watch("image_url");
  const progressPercent = Math.round(((step + 1) / STEPS.length) * 100);

  useEffect(() => {
    if (existing?.tool) {
      setValue("name", existing.tool.name);
      setValue("description", existing.tool.description ?? "");
      setValue("website_url", existing.tool.website_url ?? "");
      setValue("category", existing.tool.category as CreateToolInput["category"]);
      setValue("image_url", existing.tool.image_url ?? "");
      setValue("tags", existing.tool.tags ?? []);
      setValue("pricing", existing.tool.pricing ?? "");
      setValue("automation", existing.tool.automation ?? "");
      setValue("community", existing.tool.community ?? "");
      setValue("models", existing.tool.models ?? []);
      setValue("features", existing.tool.features ?? []);
      setValue("ai_capabilities", existing.tool.ai_capabilities ?? []);
      setValue("use_cases", existing.tool.use_cases ?? []);
      setValue("api_available", existing.tool.api_available ?? false);
      setValue("free_plan", existing.tool.free_plan ?? false);
      setValue("open_source", existing.tool.open_source ?? false);
      setValue("featured", existing.tool.featured ?? false);
      setValue("votes", existing.tool.votes ?? 0);
      setValue("logo_color", existing.tool.logo_color ?? "");

      setTagsText((existing.tool.tags ?? []).join(", "));
      setModelsText((existing.tool.models ?? []).join(", "));
      setFeaturesText((existing.tool.features ?? []).join("\n"));
      setCapabilitiesText((existing.tool.ai_capabilities ?? []).join(", "));
      setUseCasesText((existing.tool.use_cases ?? []).join("\n"));
    }
  }, [existing, setValue]);

  useEffect(() => {
    if (!existing?.tool && !isEdit) {
      setValue("logo_color", "");
    }
  }, [existing?.tool, isEdit, setValue]);

  const mutation = isEdit ? updateTool : createTool;
  const watched = watch();

  const reviewTags = useMemo(
    () => [
      watched.api_available ? "API" : "",
      watched.free_plan ? "Free" : "",
      watched.open_source ? "Open source" : "",
      watched.featured ? "Featured" : "",
    ].filter(Boolean),
    [watched.api_available, watched.featured, watched.free_plan, watched.open_source],
  );

  async function nextStep() {
    if (step === 0) {
      const ok = await trigger(["name", "website_url", "category", "description"]);
      if (!ok) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function applyImportedValues(imported: Partial<CreateToolInput>) {
    (Object.entries(imported) as Array<[keyof CreateToolInput, CreateToolInput[keyof CreateToolInput]]>).forEach(
      ([key, value]) => {
        if (value !== undefined) setValue(key, value);
      },
    );
    if (imported.tags) setTagsText(imported.tags.join(", "));
    if (imported.models) setModelsText(imported.models.join(", "));
    if (imported.features) setFeaturesText(imported.features.join("\n"));
    if (imported.ai_capabilities) setCapabilitiesText(imported.ai_capabilities.join(", "));
    if (imported.use_cases) setUseCasesText(imported.use_cases.join("\n"));
  }

  function handleImportSubmit() {
    try {
      const mapped = parseImportedTool(importJson);
      if (!mapped) {
        setImportError("Invalid JSON payload.");
        return;
      }
      applyImportedValues(mapped);
      setImportError("");
      setShowImport(false);
      setImportJson("");
    } catch {
      setImportError("JSON parse failed. Please check format.");
    }
  }

  return (
    <div className="content content--narrow">
      <div className="page-header">
        <h1 className="page-header__title">{isEdit ? "Edit tool" : "Add tool"}</h1>
        <Button type="button" variant="outline" className="page-header__action" onClick={() => setShowImport(true)}>
          <FileJson size={16} />
          Import JSON
        </Button>
      </div>

      <div className="card card--pad fade-in form-progress" style={{ marginBottom: 22 }}>
        <div className="form-steps">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              className={`step-pill${i === step ? " active" : i < step ? " done" : ""}`}
              onClick={() => i <= step && setStep(i)}
              style={{ background: "none", border: "none", cursor: i <= step ? "pointer" : "default" }}
            >
              <span className="step-pill__num">{i < step ? <Check size={14} /> : i + 1}</span>
              <span className="step-pill__label">{label}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <div className="progress-track" style={{ flex: 1 }}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, color: "var(--accent-text)" }}>
            {progressPercent}%
          </span>
        </div>
      </div>

      <form
        className="card card--pad space-y-4"
        key={step}
        onSubmit={handleSubmit((data) =>
          mutation.mutate(data as CreateToolInput, {
            onSuccess: (tool) => navigate(`/tools/${tool.id}`),
          }),
        )}
      >
        {step === 0 && (
          <>
            <div className="field-row">
              <div className="field">
                <label className="field__label">Name</label>
                <input className="input w-full" {...register("name")} />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div className="field">
                <label className="field__label">Website URL</label>
                <input className="input w-full" {...register("website_url")} />
                {errors.website_url && <p className="text-sm text-red-600">{errors.website_url.message}</p>}
              </div>
            </div>
            <div className="field">
              <label className="field__label">Category</label>
              <select className="select w-full" {...register("category")}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label">Description</label>
              <textarea className="textarea w-full" rows={4} {...register("description")} />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="field">
              <label className="field__label">Features (one per line)</label>
              <textarea
                className="textarea w-full"
                rows={3}
                value={featuresText}
                onChange={(e) => {
                  setFeaturesText(e.target.value);
                  setValue("features", splitByLine(e.target.value));
                }}
              />
            </div>
            <div className="field">
              <label className="field__label">AI capabilities (comma separated)</label>
              <input
                className="input w-full"
                value={capabilitiesText}
                onChange={(e) => {
                  setCapabilitiesText(e.target.value);
                  setValue("ai_capabilities", splitByComma(e.target.value));
                }}
              />
            </div>
            <div className="field">
              <label className="field__label">Use cases (one per line)</label>
              <textarea
                className="textarea w-full"
                rows={3}
                value={useCasesText}
                onChange={(e) => {
                  setUseCasesText(e.target.value);
                  setValue("use_cases", splitByLine(e.target.value));
                }}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="field-row">
              <label className="check">
                <input type="checkbox" {...register("api_available")} /> API available
              </label>
              <label className="check">
                <input type="checkbox" {...register("open_source")} /> Open source
              </label>
            </div>
            <div className="field">
              <label className="field__label">Models (comma separated)</label>
              <input
                className="input w-full"
                value={modelsText}
                onChange={(e) => {
                  setModelsText(e.target.value);
                  setValue("models", splitByComma(e.target.value));
                }}
              />
            </div>
            <div className="field">
              <label className="field__label">Automation</label>
              <input className="input w-full" {...register("automation")} />
            </div>
            <div className="field">
              <label className="field__label">Image URL</label>
              <input className="input w-full" placeholder="https://..." {...register("image_url")} />
              {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 h-24 rounded object-cover" />}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="field-row">
              <div className="field">
                <label className="field__label">Pricing</label>
                <input className="input w-full" {...register("pricing")} />
              </div>
              <div className="field">
                <label className="field__label">Community</label>
                <input className="input w-full" {...register("community")} />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label className="field__label">Votes</label>
                <input className="input w-full" type="number" {...register("votes", { valueAsNumber: true })} />
              </div>
              <div className="field">
                <label className="field__label">Logo Color</label>
                <input className="input w-full" placeholder="oklch(...) or #hex" {...register("logo_color")} />
              </div>
            </div>
            <div className="field-row">
              <label className="check">
                <input type="checkbox" {...register("free_plan")} /> Free plan
              </label>
              <label className="check">
                <input type="checkbox" {...register("featured")} /> Featured
              </label>
            </div>
            <div className="field">
              <label className="field__label">Tags (comma separated)</label>
              <input
                className="input w-full"
                placeholder="LLM, Assistant, Summarize"
                value={tagsText}
                onChange={(e) => {
                  setTagsText(e.target.value);
                  setValue("tags", splitByComma(e.target.value));
                }}
              />
            </div>
          </>
        )}

        {step === 4 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div
                className="logo-tile"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  fontSize: 16,
                  background: watched.logo_color || "var(--accent)",
                }}
              >
                {(watched.name ?? "NT")
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((x) => x[0]?.toUpperCase() ?? "")
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: 19, fontWeight: 750 }}>{watched.name || "Untitled tool"}</div>
                <div style={{ color: "var(--text-3)", fontSize: 13.5 }}>
                  {watched.category}
                  {watched.website_url ? ` · ${watched.website_url}` : ""}
                </div>
              </div>
            </div>
            <p style={{ color: "var(--text-2)", fontSize: 14.5, lineHeight: 1.6 }}>
              {watched.description || "No description provided yet."}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {reviewTags.map((tag) => (
                <span key={tag} className="badge badge--green">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {mutation.isError && (
          <p className="text-sm text-red-600">{(mutation.error as Error).message}</p>
        )}

        <div className="form-nav">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(s - 1, 0))}>
              <ArrowLeft size={16} />
              Back
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Continue
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving…" : isEdit ? "Update tool" : "Create tool"}
              </Button>
            )}
          </div>
        </div>
      </form>

      {showImport && (
        <div className="modal-overlay" onClick={() => setShowImport(false)}>
          <div className="modal-card card card--pad" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, marginBottom: 12 }}>Import tool JSON</h2>
            <p style={{ color: "var(--text-3)", marginTop: 0, marginBottom: 12 }}>
              Paste one tool JSON object or array. First record will be used.
            </p>
            <div className="dropzone" style={{ padding: 20, textAlign: "left", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Upload size={16} />
                <strong>Upload JSON file</strong>
              </div>
              <input
                type="file"
                accept=".json,application/json"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const text = await file.text();
                  setImportJson(text);
                }}
              />
            </div>
            <textarea
              className="code-area"
              placeholder='{"name":"Orion Chat","category":"chat","tags":["LLM"]}'
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
            />
            {importError && <p className="text-sm text-red-600">{importError}</p>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
              <Button type="button" variant="outline" onClick={() => setShowImport(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleImportSubmit}>
                Apply import
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

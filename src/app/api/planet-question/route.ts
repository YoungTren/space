import { NextResponse } from "next/server";

import { getBodyConfig, isBodyId } from "@/lib/planets";

const pickBodyId = (body: Record<string, unknown>): unknown =>
  body.bodyId ?? body.planetId;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("question" in body)
  ) {
    return NextResponse.json(
      { error: "Ожидаются bodyId (или planetId) и question" },
      { status: 400 },
    );
  }

  const rec = body as Record<string, unknown>;
  const bodyIdRaw = pickBodyId(rec);
  const questionRaw = rec.question;

  if (!isBodyId(bodyIdRaw)) {
    return NextResponse.json({ error: "Неизвестный объект" }, { status: 400 });
  }

  if (typeof questionRaw !== "string") {
    return NextResponse.json({ error: "Вопрос должен быть строкой" }, { status: 400 });
  }

  const question = questionRaw.trim();
  if (question.length === 0) {
    return NextResponse.json({ error: "Пустой вопрос" }, { status: 400 });
  }

  const cfg = getBodyConfig(bodyIdRaw);
  const name = cfg?.nameRu ?? bodyIdRaw;

  await new Promise((r) => setTimeout(r, 650));

  const answer = [
    `Это демонстрационный ответ без подключения к внешней языковой модели.`,
    `Контекст: вы спрашивали об объекте **${name}**.`,
    `Ваш вопрос: «${question}».`,
    ``,
    `В продакшене сюда подставляется ответ модели с учётом выбранного тела. Пока вы можете опираться на список фактов в панели.`,
  ].join("\n");

  return NextResponse.json({ answer });
}

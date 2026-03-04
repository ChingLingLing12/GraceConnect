import HomeClient from "./HomeClient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ ministry?: string }>;
}) {
  const params = await searchParams;

  const ministry =
    params.ministry === "youth" || params.ministry === "sundayschool"
      ? params.ministry
      : null;

  return <HomeClient ministry={ministry} />;
}
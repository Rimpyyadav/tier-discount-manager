import { useLoaderData, Form } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const rules = await db.tierRule.findMany({
    where: { shop: session.shop },
    orderBy: { minQuantity: "asc" },
  });
  return { rules };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "create") {
    const minQuantity = parseInt(form.get("minQuantity"), 10);
    const percentOff = parseFloat(form.get("percentOff"));
    if (!(minQuantity >= 2) || !(percentOff > 0 && percentOff <= 100)) {
      return { error: "Enter a quantity of 2 or more and a percent between 0 and 100." };
    }
    await db.tierRule.create({
      data: { shop: session.shop, minQuantity, percentOff },
    });
  }

  if (intent === "delete") {
    await db.tierRule.deleteMany({
      where: { id: form.get("id"), shop: session.shop },
    });
  }
  return { ok: true };
};

export default function Tiers() {
  const { rules } = useLoaderData();
  return (
    <s-page heading="Discount tiers">
      <s-section heading="Add a tier">
        <Form method="post">
          <input type="hidden" name="intent" value="create" />
          <label>Minimum quantity <input name="minQuantity" type="number" min="2" required /></label>
          <label>Percent off <input name="percentOff" type="number" step="0.5" required /></label>
          <button type="submit">Add</button>
        </Form>
      </s-section>
      <s-section heading="Your tiers">
        {rules.length === 0 && <p>No tiers yet.</p>}
        {rules.map((r) => (
          <Form method="post" key={r.id}>
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="id" value={r.id} />
            Buy {r.minQuantity}+, get {r.percentOff}% off{" "}
            <button type="submit">Delete</button>
          </Form>
        ))}
      </s-section>
    </s-page>
  );
}
export async function analyzeFeedback(content: string) {
  const text = content.toLowerCase();

  // ==========================
  // POSITIVE (Check First)
  // ==========================

  if (
    text.includes("excellent") ||
    text.includes("great") ||
    text.includes("good") ||
    text.includes("love") ||
    text.includes("awesome") ||
    text.includes("amazing") ||
    text.includes("fantastic") ||
    text.includes("easy") ||
    text.includes("fast") ||
    text.includes("helpful") ||
    text.includes("quick") ||
    text.includes("perfect") ||
    text.includes("clean") ||
    text.includes("smooth") ||
    text.includes("resolved") ||
    text.includes("solved") ||
    text.includes("friendly") ||
    text.includes("responsive") ||
    text.includes("recommend") ||
    text.includes("satisfied")
  ) {
    let theme = "Customer Support";

    if (
      text.includes("website") ||
      text.includes("dashboard") ||
      text.includes("design") ||
      text.includes("ui")
    ) {
      theme = "UI/UX";
    }

    if (
      text.includes("payment")
    ) {
      theme = "Payment";
    }

    if (
      text.includes("fast") ||
      text.includes("performance")
    ) {
      theme = "Performance";
    }

    return {
      sentiment: "POSITIVE",
      theme,
      priority: "LOW",
      summary: "Customer is satisfied with the service.",
    };
  }

  // ==========================
  // NEGATIVE
  // ==========================

  if (
    text.includes("crash") ||
    text.includes("bug") ||
    text.includes("error") ||
    text.includes("failed") ||
    text.includes("failure") ||
    text.includes("slow") ||
    text.includes("freeze") ||
    text.includes("freezes") ||
    text.includes("loading") ||
    text.includes("delay") ||
    text.includes("unable") ||
    text.includes("worst") ||
    text.includes("bad") ||
    text.includes("terrible") ||
    text.includes("disappointed") ||
    text.includes("not working") ||
    text.includes("refund") ||
    text.includes("billing")
  ) {
    let theme = "Bug Report";

    if (
      text.includes("slow") ||
      text.includes("freeze") ||
      text.includes("loading") ||
      text.includes("performance")
    ) {
      theme = "Performance";
    } else if (
      text.includes("payment") ||
      text.includes("refund") ||
      text.includes("billing")
    ) {
      theme = "Payment";
    } else if (
      text.includes("login") ||
      text.includes("password") ||
      text.includes("account")
    ) {
      theme = "Account";
    } else if (
      text.includes("support") ||
      text.includes("customer service")
    ) {
      theme = "Customer Support";
    }

    return {
      sentiment: "NEGATIVE",
      theme,
      priority: "HIGH",
      summary: "Customer reported a negative experience.",
    };
  }

  // ==========================
  // FEATURE REQUEST
  // ==========================

  if (
    text.includes("add") ||
    text.includes("feature") ||
    text.includes("please include") ||
    text.includes("dark mode") ||
    text.includes("would like") ||
    text.includes("improve") ||
    text.includes("export") ||
    text.includes("notification")
  ) {
    return {
      sentiment: "NEUTRAL",
      theme: "Feature Request",
      priority: "MEDIUM",
      summary: "Customer requested a new feature.",
    };
  }

  // ==========================
  // DEFAULT
  // ==========================

  return {
    sentiment: "NEUTRAL",
    theme: "General Feedback",
    priority: "LOW",
    summary: "General customer feedback.",
  };
}
(function (window) {
    function initAIWidget({ companyId, selector }) {
        const getUserId = () =>
            localStorage.getItem("esher_user_id") ||
            (localStorage.setItem(
                "esher_user_id",
                "user_" +
                    Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15)
            ),
            localStorage.getItem("esher_user_id"));

        const trackVisit = () => {
            const userId = getUserId(),
                today = new Date().toISOString().split("T")[0],
                visitKey = `esher_visit_${companyId}_${today}`;

            if (!localStorage.getItem(visitKey)) {
                localStorage.setItem(visitKey, "true");
                fetch("https://your-api.com/track-visit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId,
                        companyId,
                        url: window.location.href,
                        timestamp: new Date().toISOString(),
                    }),
                })
                    .then((res) => res.ok && console.log("Visit tracked"))
                    .catch((err) => console.error("Tracking error:", err));
            }
        };

        const initializeWidget = () => {
            if (!window.aiWidget || window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                window.aiWidget = new AIWidget(selector, "relative", companyId, currentUrl);
                trackVisit();
            }
        };

        const loadScript = () =>
            new Promise((res, rej) => {
                const s = document.createElement("script");
                s.src = `https://your-cdn.com/widget.js/${companyId}`;
                s.async = true;
                s.onload = res;
                s.onerror = rej;
                document.head.appendChild(s);
            });

        new MutationObserver((m) => {
            for (const mut of m) {
                if (mut.addedNodes.length && document.querySelector(selector)) {
                    initializeWidget();
                    break;
                }
            }
        }).observe(document.body, { childList: true, subtree: true });

        document.addEventListener("DOMContentLoaded", async () => {
            try {
                await loadScript();
                document.querySelector(selector) && initializeWidget();
            } catch (e) {
                console.error("Script load failed:", e);
            }
        });
    }

    window.EsherAI = { init: initAIWidget };
})(window);

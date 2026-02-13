# Notification Strategy: AI Nexus

To implement the push notification flow for "Breaking News" only:

1. **Relevance Filtering**:
   - The `AIService` should flag news as `impact_level: "High"`.
   - Only stories with `impact_level == "High"` trigger a notification event.

2. **Backend implementation**:
   - Use **Supabase Edge Functions** or a background worker (Celery/Redis).
   - Integration with **Firebase Cloud Messaging (FCM)** or **Expo Notifications**.

3. **Example Flow**:
   ```python
   if news.impact_level == "High":
       send_push_notification(
           title=" Breaking AI News",
           body=f"{news.title}",
           topic="breaking_news"
       )
   ```

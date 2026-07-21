/**
 * Newsletter Service
 * -------------------------------------------------------
 * @placeholder — replace with actual email platform API
 */

const newsletterService = {
  /**
   * Subscribe an email address to the newsletter.
   * @placeholder — replace with: apiClient.post('/newsletter/subscribe', { email })
   */
  async subscribe(email: string): Promise<{ success: boolean }> {
    // TODO: apiClient.post('/newsletter/subscribe', { email })
    console.log("Newsletter subscription placeholder:", email);
    return { success: true };
  },
};

export default newsletterService;

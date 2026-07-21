/**
 * Contact Service
 * -------------------------------------------------------
 * @placeholder — replace with actual contact/email backend
 */

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: "general" | "sales" | "support" | "partnership";
}

const contactService = {
  /**
   * Submit a contact form message.
   * @placeholder — replace with: apiClient.post('/contact', data)
   */
  async submit(data: ContactFormData): Promise<{ success: boolean }> {
    // TODO: apiClient.post('/contact', data)
    console.log("Contact form placeholder:", data);
    return { success: true };
  },
};

export default contactService;

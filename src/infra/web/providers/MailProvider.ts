export interface MailProvider {
  sendVerificationEmail(to: string, token: string): Promise<void>;
}

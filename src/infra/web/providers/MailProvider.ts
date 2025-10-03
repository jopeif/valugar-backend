export interface MailProvider {
  sendVerificationEmail(to: string, token: string): Promise<void>;

  sendLoginNotification(to: string, date: Date): Promise<void>;
}

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export function Privacy() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-amber-400 border-none bg-transparent hover:bg-transparent hover:text-amber-400 underline">Privacy Notice</Button>
        </DialogTrigger>

        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
      <DialogTitle>Privacy Notice</DialogTitle>
 
    </DialogHeader>
          <div >
                            <p>
                              At Endless Grind Fitness, we value your privacy and are committed to protecting your personal information.
                              This Privacy Notice explains what information we collect, why we collect it, and how it is used within our gym
                              membership system and online platform. By creating an account, submitting an application, or using our services,
                              you agree to this Privacy Notice.
                            </p>

                            <h3>1. Information We Collect</h3>

                            <h4>Personal Information</h4>
                            <ul className="list-disc ml-6">
                              <li>Name</li>
                              <li>Sex</li>
                              <li>Age / Date of Birth</li>
                              <li>Contact details (email and address)</li>
                              <li>Optional social media link</li>
                              <li>Uploaded ID for identity verification</li>
                            </ul>

                            <h4>Fitness &amp; Membership Information</h4>
                            <ul className="list-disc ml-6">
                              <li>Height and weight</li>
                              <li>Fitness goals</li>
                              <li>Chosen membership package</li>
                              <li>Assigned coach</li>
                              <li>Training session history and logs</li>
                            </ul>

                            <h4>Payment Information</h4>
                            <ul className="list-disc ml-6">
                              <li>Payment amount and status</li>
                              <li>Transaction reference numbers</li>
                            </ul>

                            <h4>Basic System Data</h4>
                            <ul className="list-disc ml-6">
                              <li>Login activity</li>
                              <li>Browser/device information</li>
                              <li>General usage patterns</li>
                            </ul>

                            <p>This helps ensure system security and proper functionality.</p>

                            <h3>2. How We Use Your Information</h3>
                            <ul className="list-disc ml-6">
                              <li>Creating and managing your account</li>
                              <li>Processing membership applications</li>
                              <li>Assigning coaches and managing training schedules</li>
                              <li>Handling payments and sending receipts</li>
                              <li>Sending notifications about your membership status</li>
                              <li>Improving user experience and platform performance</li>
                              <li>Maintaining system safety and preventing fraud</li>
                            </ul>
                            <p>We do not use your information for advertising or sell it to third parties.</p>

                            <h3>3. How We Protect Your Information</h3>
                            <ul className="list-disc ml-6">
                              <li>We use standard security practices to keep your information safe.</li>
                              <li>Access to your data is limited to authorized personnel only.</li>
                              <li>We do not publicly share or disclose your personal details unless required by law.</li>
                            </ul>

                            <h3>4. When We Share Information</h3>
                            <ul className="list-disc ml-6">
                              <li>Payment partners for processing transactions</li>
                              <li>Email services for sending membership updates and receipts</li>
                              <li>Assigned coaches for managing your training program</li>
                            </ul>

                            <h3>5. Your Rights</h3>
                            <ul className="list-disc ml-6">
                              <li>Access to your personal information</li>
                              <li>Correction of inaccurate information</li>
                              <li>Deletion of your account and data</li>
                              <li>Withdrawal of a pending membership application</li>
                            </ul>

                            <h3>6. Data Retention</h3>
                            <p>
                              Your information is kept only as long as necessary to provide services, comply with regulations, and maintain
                              important records. Archived applications are stored separately and may be removed upon request.
                            </p>

                            <h3>7. Updates to This Privacy Notice</h3>
                            <p>
                              We may update this Privacy Notice when needed. Any changes will be posted on this page with a revised date.
                              Continued use of the website means you accept the updated notice.
                            </p>

                            <h3>8. Contact Us</h3>
                            <p>📧 endlessgrindfitnesscenter@gmail.com</p>
                            <p>📞 +63 976 044 3407</p>
                            </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}

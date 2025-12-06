import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export function Conditions() {
  return (
    <Dialog >
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-amber-400 border-none bg-transparent hover:bg-transparent hover:text-amber-400 underline">Condition of Use</Button>
        </DialogTrigger>

        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
      <DialogTitle>Condition of Use</DialogTitle>
 
    </DialogHeader>
        <div>
            <p>
                Welcome to Endless Grind Fitness! By creating an account and using our online gym platform,
                you agree to comply with the following Terms and Conditions. Please read them carefully before
                registering or using our services.
            </p>

            <h3>1. Acceptance of Terms</h3>
            <ul className="list-disc ml-6">
                <li>
                By registering for an account, accessing, or using this website, you confirm that you have
                read, understood, and agree to be bound by these Terms and Conditions, as well as our Privacy Policy.
                </li>
                <li>If you do not agree, please do not use our website.</li>
            </ul>

            <h3>2. Account Registration</h3>
            <ul className="list-disc ml-6">
                <li>You agree to provide accurate, current, and complete information during registration.</li>
                <li>You are responsible for maintaining the confidentiality of your username and password.</li>
                <li>You must immediately notify us if you suspect unauthorized use of your account.</li>
            </ul>

            <h3>3. Membership and Payments</h3>
            <ul className="list-disc ml-6">
                <li>Some services may require payment or subscription.</li>
                <li>All fees are non-refundable except as required by law.</li>
                <li>
                We reserve the right to change membership pricing or benefits, with notice provided on the website.
                </li>
            </ul>

            <h3>4. User Responsibilities</h3>
            <p>You agree not to:</p>
            <ul className="list-disc ml-6">
                <li>Share your login details with others.</li>
                <li>Use the website for illegal or unauthorized purposes.</li>
                <li>Attempt to hack, damage, or disrupt the system or other users.</li>
            </ul>

            <h3>5. Health and Safety Disclaimer</h3>
            <ul className="list-disc ml-6">
                <li>The workouts and fitness guidance provided on this website are for general fitness purposes.</li>
                <li>You should consult a physician before starting any new exercise program.</li>
                <li>
                Endless Grind Fitness is not liable for injuries, health issues, or damages resulting from
                the use of our fitness programs or services.
                </li>
            </ul>

            <h3>6. Content Ownership</h3>
            <ul className="list-disc ml-6">
                <li>All materials on this site (text, logos, images) are owned by Endless Grind Fitness.</li>
                <li>You may not reproduce, distribute, or use any content without our written permission.</li>
            </ul>

            <h3>7. Termination of Account</h3>
            <ul className="list-disc ml-6">
                <li>
                We reserve the right to suspend or delete your account at any time if you violate these
                Terms or misuse our services.
                </li>
            </ul>

            <h3>8. Limitation of Liability</h3>
            <ul className="list-disc ml-6">
                <li>
                Endless Grind Fitness will not be responsible for any indirect, incidental, or consequential
                damages arising from your use of the website or services.
                </li>
            </ul>

            <h3>9. Updates to Terms &amp; Conditions</h3>
            <ul className="list-disc ml-6">
                <li>
                We may modify these Terms and Conditions at any time. Updated versions will be posted on this
                page with a revised “Last Modified.”
                </li>
                <li>Continued use of the website means you accept the updated terms.</li>
            </ul>

            <h3>10. Contact Us</h3>
            <p>📧 endlessgrindfitnesscenter@gmail.com</p>
            <p>📞 +63 976 044 3407</p>
        </div>

    </DialogContent>
      </form>
    </Dialog>
  )
}

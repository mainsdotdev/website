"use client";

import { useState, useEffect, FormEvent } from "react";
import { createPortal } from "react-dom";

type WaitlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
    role: "",
    useCase: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (for portal)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({ email: "", name: "", company: "", role: "", useCase: "" });
        setError("");
        setSuccess(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError("Error submitting form. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998 transition-opacity "
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-9999 flex items-center font-mono justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="bg-primary-900 rounded-lg shadow-2xl w-full max-w-md p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-primary-300 hover:text-primary-50 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Modal Title */}
          <h2
            id="modal-title"
            className="text-2xl font-bold text-white mb-2"
          >
            Join Beta Waitlist
          </h2>
          <p className="text-primary-300 text-sm mb-6">
            Be among the first to experience Jinzo.
          </p>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                You're on the list!
              </h3>
              <p className="text-primary-300 text-sm">
                We'll notify you when beta access is available.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email (required) */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white mb-1.5"
                >
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-primary-700 rounded-md bg-primary-800 text-white placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                  placeholder="you@example.com"
                />
              </div>

              {/* Name (optional) */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white mb-1.5"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-primary-700 rounded-md bg-primary-800 text-white placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                  placeholder="Your name"
                />
              </div>

              {/* Company (optional) */}
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-white mb-1.5"
                >
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-primary-700 rounded-md bg-primary-800 text-white placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                  placeholder="Your company"
                />
              </div>

              {/* Role (optional) */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-white mb-1.5"
                >
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-primary-700 rounded-md bg-primary-800 text-white placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                  placeholder="e.g. Developer, Designer"
                />
              </div>

              {/* Use Case (optional) */}
              <div>
                <label
                  htmlFor="useCase"
                  className="block text-sm font-medium text-white mb-1.5"
                >
                  What do you want to use it for?
                </label>
                <textarea
                  id="useCase"
                  rows={3}
                  value={formData.useCase}
                  onChange={(e) =>
                    setFormData({ ...formData, useCase: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-primary-700 rounded-md bg-primary-800 text-white placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow resize-none"
                  placeholder="Tell us about your use case..."
                />
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-400 text-sm font-medium">{error}</p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}

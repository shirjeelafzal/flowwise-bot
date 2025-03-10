import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { credentialSchemas } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface ChannelConfigDialogProps {
  type: "whatsapp" | "telegram" | "messenger" | "tiktok" | "sms";
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (credentials: any) => void;
}

export default function ChannelConfigDialog({
  type,
  isOpen,
  onClose,
  onSubmit,
}: ChannelConfigDialogProps) {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const schema = credentialSchemas[type];

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const handleSubmit = async (data: any) => {
    try {
      onSubmit({ type, ...data });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save credentials",
        variant: "destructive",
      });
    }
  };

  const testConnection = async (data: any) => {
    setIsTesting(true);
    try {
      const response = await apiRequest('POST', `/api/channels/test/${type}`, data);
      toast({
        title: "Success",
        description: `${type.toUpperCase()} connection test successful`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to test ${type.toUpperCase()} connection`,
        variant: "destructive",
      });
    }
    setIsTesting(false);
  };

  const renderFields = () => {
    switch (type) {
      case "whatsapp":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <Input {...form.register("apiKey")} type="password" />
              {form.formState.errors.apiKey && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.apiKey.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number ID</label>
              <Input {...form.register("phoneNumberId")} />
              {form.formState.errors.phoneNumberId && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.phoneNumberId.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Account ID</label>
              <Input {...form.register("businessAccountId")} />
              {form.formState.errors.businessAccountId && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.businessAccountId.message as string}
                </p>
              )}
            </div>
          </>
        );

      case "telegram":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bot Token</label>
              <Input {...form.register("botToken")} type="password" />
              {form.formState.errors.botToken && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.botToken.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Webhook URL</label>
              <Input {...form.register("webhookUrl")} />
              {form.formState.errors.webhookUrl && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.webhookUrl.message as string}
                </p>
              )}
            </div>
          </>
        );

      case "tiktok":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Access Token</label>
              <Input {...form.register("accessToken")} type="password" />
              {form.formState.errors.accessToken && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.accessToken.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Key</label>
              <Input {...form.register("clientKey")} type="password" />
              {form.formState.errors.clientKey && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.clientKey.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Secret</label>
              <Input {...form.register("clientSecret")} type="password" />
              {form.formState.errors.clientSecret && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.clientSecret.message as string}
                </p>
              )}
            </div>
          </>
        );

      case "sms":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account SID</label>
              <Input {...form.register("accountSid")} type="password" />
              {form.formState.errors.accountSid && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.accountSid.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Auth Token</label>
              <Input {...form.register("authToken")} type="password" />
              {form.formState.errors.authToken && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.authToken.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Twilio Phone Number</label>
              <Input {...form.register("phoneNumber")} />
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.phoneNumber.message as string}
                </p>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure {type.toUpperCase()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {renderFields()}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => testConnection(form.getValues())}
              disabled={isTesting || !form.formState.isValid}
            >
              {isTesting ? "Testing..." : `Test ${type.toUpperCase()} Connection`}
            </Button>
            <Button type="submit">Save Configuration</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
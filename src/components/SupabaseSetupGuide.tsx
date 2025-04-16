
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function SupabaseSetupGuide() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">
            Supabase Connection Error
          </CardTitle>
          <CardDescription>
            Your application is missing the required Supabase configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Missing Environment Variables</AlertTitle>
            <AlertDescription>
              The application cannot connect to Supabase because the required environment variables are missing.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Follow these steps to connect to Supabase:</h3>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Click on the green Supabase button in the top right of the Lovable interface</li>
              <li>Follow the instructions to connect your project to Supabase</li>
              <li>Once connected, Lovable will automatically set up the required environment variables</li>
              <li>Refresh the page after the setup is complete</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="default" 
            onClick={() => window.location.reload()}
            className="mr-2"
          >
            Refresh Page
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open('https://docs.lovable.dev/integrations/supabase/', '_blank')}
          >
            Supabase Integration Docs
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

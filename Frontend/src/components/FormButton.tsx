import { Button, ButtonProps } from "@chakra-ui/react";

interface FormButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export default function FormButton({ children, isLoading, ...props }: FormButtonProps) {
  return (
    <Button
      w="100%"
      bgGradient="linear(to-r, blue.400, teal.400)"
      color="white"
      fontWeight="bold"
      _hover={{ bgGradient: "linear(to-r, blue.500, teal.500)" }}
      _active={{ bgGradient: "linear(to-r, blue.600, teal.600)" }}
      borderRadius="lg"
      isLoading={isLoading}
      {...props}
      type="submit"
    >
      {children}
    </Button>
  );
}

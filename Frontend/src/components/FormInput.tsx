import { FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { InputProps } from "@chakra-ui/react";

interface FormInputProps extends InputProps {
  label: string;
  error?: string;
}

export default function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel fontWeight="semibold" color="gray.600">{label}</FormLabel>
      <Input
        {...props}
        focusBorderColor="blue.400"
        borderRadius="lg"
        bg="gray.50"
        _hover={{ bg: "gray.100" }}
      />
      {error && <Text color="red.500" fontSize="sm" mt={1}>{error}</Text>}
    </FormControl>
  );
}

import {
  Button,
  Flex,
  Text,
  Textarea,
  Box,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { uniqueId } from "lodash";

interface Todo {
  id: string;
  title: string;
  description: string;
}

const schema = yup.object().shape({
  title: yup.string().required("Please provide a title."),
  description: yup.string(),
});

const TodoForm: React.FC = () => {
  const [isTextareaShown, setTextareaShown] = useState(false);
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Todo>({
    resolver: yupResolver(schema),
    defaultValues: {
      description: "This is a default description!",
    },
  });

  const simulateNetworkRequest = (ms: number) =>
    new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, ms);
    });

  const onSubmit = async (todo: Todo) => {
    await simulateNetworkRequest(2000);
    setTodoList((todos) => [...todos, { ...todo, id: uniqueId() }]);
    reset();
    setTextareaShown(false);
  };

  return (
    <Box ml="4rem" mt="3.75rem">
      <Flex justifyItems="center">
        <Text
          as="span"
          fontWeight="600"
          color="gray.100"
          display="block"
          fontSize="2xl"
          mr="2rem"
        >
          Today
        </Text>
        <Button
          variant="outline"
          color="gray.200"
          _hover={{ color: "gray.700", backgroundColor: "white" }}
          leftIcon={<FiPlus />}
          display={isTextareaShown ? "none" : "block"}
          onClick={() => {
            setTextareaShown(true);
          }}
        >
          Add task
        </Button>
      </Flex>
      <Box mt="2rem">
        {!todoList.length && !isTextareaShown && (
          <Text as="span" color="gray.200">
            You're all cleared! You don't have to do anything for today.
          </Text>
        )}
        {todoList.map((todo) => (
          <Flex
            key={todo.id}
            border="1px solid white"
            borderRadius="6px"
            minW="md"
            p="16px 20px"
            color="white"
            justifyItems="start"
          >
            <Box mt="4px" mr="16px">
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    setTodoList((existingTodos) =>
                      existingTodos.filter((e) => e.id !== todo.id)
                    );
                  }
                }}
              />
            </Box>
            <Box>
              <Text as="span" display="block">
                {todo.title}
              </Text>
              <Text as="p" fontSize="xs" color="gray.200" mt="4px">
                {todo.description}
              </Text>
            </Box>
          </Flex>
        ))}
      </Box>
      <Box display={isTextareaShown ? "block" : "none"} minW="400px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            placeholder="Title"
            isInvalid={!!errors.title?.message}
            color="gray.200"
            {...register("title")}
          />
          <Text as="span" display="block" color="red.400" fontSize="sm">
            {errors.title?.message}
          </Text>
          <Textarea
            color="gray.200"
            placeholder="Describe what you will do..."
            mt="0.5rem"
            {...register("description")}
          />
          <Flex mt="2rem">
            <Button
              type="submit"
              colorScheme="blackAlpha"
              color="gray.200"
              _hover={{ color: "gray.700", backgroundColor: "white" }}
              mr="0.5rem"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Add task
            </Button>
            <Button
              type="button"
              variant="outline"
              color="gray.200"
              _hover={{ color: "gray.700", backgroundColor: "white" }}
              onClick={() => {
                setTextareaShown(false);
                reset();
              }}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default TodoForm;

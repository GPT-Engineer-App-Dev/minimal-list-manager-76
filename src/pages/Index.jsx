const Index = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoContent, setNewTodoContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  // Misplaced function definitions have been removed.

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchTodos();
    }
  }, [isLoggedIn, token]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/todos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else {
        throw new Error("Failed to fetch todos");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        setIsLoggedIn(true);
        fetchTodos();
      } else {
        throw new Error("Invalid login credentials");
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateTodo = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title: newTodoTitle, content: newTodoContent }),
      });
      if (response.status === 201) {
        setNewTodoTitle("");
        setNewTodoContent("");
        fetchTodos();
      } else {
        throw new Error("Failed to create todo");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTodos();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Container centerContent>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button colorScheme="blue" onClick={handleLogin}>
            Login
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container centerContent>
      <VStack spacing={4}>
        <FormControl id="new-todo-title" isRequired>
          <FormLabel>Title</FormLabel>
          <Input placeholder="Enter todo title" value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} />
        </FormControl>
        <FormControl id="new-todo-content" isRequired>
          <FormLabel>Content</FormLabel>
          <Input placeholder="Enter todo content" value={newTodoContent} onChange={(e) => setNewTodoContent(e.target.value)} />
        </FormControl>
        <Button colorScheme="blue" leftIcon={<FaPlus />} onClick={handleCreateTodo}>
          Add Todo
        </Button>
        <Box w="100%">
          <Text fontSize="xl" fontWeight="bold">
            Todos:
          </Text>
          <List spacing={3}>
            {todos.map((todo, index) => (
              <ListItem key={index} p={2} shadow="md" borderWidth="1px">
                <Text fontWeight="bold">{todo.title}</Text>
                <Text>{todo.content}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;

import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Flex,
  Icon,
  Avatar,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { FiSend, FiInfo, FiMessageCircle } from "react-icons/fi";
import UsersList from "./UsersList";
import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import apiURL from "../../utils";
import PropTypes from "prop-types";

const ChatArea = ({ selectedGroup, socket, setSelectedGroup }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const toast = useToast();

  // Read the current session once so message ownership and API calls use the same user.
  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem("userInfo") || "null") || {};
  } catch {
    localStorage.removeItem("userInfo");
  }
  const getUserName = (user) => user?.userName || user?.username || "User";
  const currentUserName = getUserName(currentUser);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const fetchMessages = useCallback(
    async (groupId) => {
      const token = currentUser?.token;
      try {
        const { data } = await axios.get(`${apiURL}/api/messages/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(data);
      } catch (error) {
        toast({
          title: "Unable to load messages",
          description:
            error?.response?.data?.message || "Please try again in a moment.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [currentUser?.token, toast],
  );

  useEffect(() => {
    if (selectedGroup && socket) {
      // Load history and subscribe to live events whenever the active group changes.
      fetchMessages(selectedGroup._id);
      socket.emit("joinRoom", selectedGroup?._id);
      socket.on("messageReceived", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      socket.on("usersInRoom", (users) => {
        setConnectedUsers(users);
      });

      socket.on("userLeft", (userId) => {
        setConnectedUsers((prev) =>
          prev.filter((user) => user?._id !== userId),
        );
      });

      socket.on("notification", (notification) => {
        toast({
          title:
            notification?.type === "user_joined"
              ? "New User"
              : notification?.type === "user_left"
                ? "User Left"
                : "Notification",
          description: notification.message,
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });

      socket.on("userTyping", (user) => {
        setTypingUsers((prev) => new Set(prev).add(user));
      });

      socket.on("userStoppedTyping", (user) => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(user);
          return newSet;
        });
      });
      // Leave the room and remove listeners before switching groups or unmounting.
      return () => {
        socket.emit("leaveRoom", selectedGroup?._id);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
        setIsTyping(false);
        setTypingUsers(new Set());
        setConnectedUsers([]);
        socket.off("messageReceived");
        socket.off("usersInRoom");
        socket.off("userLeft");
        socket.off("notification");
        socket.off("userTyping");
        socket.off("userStoppedTyping");
      };
    }
  }, [fetchMessages, selectedGroup, socket, toast]);

  // Persist the message first, then broadcast the saved record to other room members.
  const sendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }
    try {
      const token = currentUser.token;
      const { data } = await axios.post(
        `${apiURL}/api/messages`,
        {
          content: newMessage.trim(),
          groupId: selectedGroup?._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      socket.emit("newMessage", {
        ...data,
        groupId: selectedGroup?._id,
      });

      setMessages((previousMessages) => [...previousMessages, data]);
      setNewMessage("");
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (selectedGroup) {
        socket.emit("stopTyping", selectedGroup._id);
      }
      setIsTyping(false);
    } catch {
      toast({
        title: "Error sending message",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  // Notify the room while the user types and stop after two seconds of inactivity.
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping && selectedGroup) {
      setIsTyping(true);
      socket.emit("typing", selectedGroup?._id);
    }
    // Reset the timer on every keystroke so the indicator does not disappear early.
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // Emit the stop event once the user has stopped typing.
    typingTimeoutRef.current = setTimeout(() => {
      if (selectedGroup) {
        socket.emit("stopTyping", selectedGroup?._id);
      }
      setIsTyping(false);
    }, 2000);
  };
  //format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  //render typing indicator
  const renderTypingIndicator = () => {
    if (typingUsers.size === 0) return null;
    const typingUsersArray = Array.from(typingUsers);

    return typingUsersArray?.map((username) => (
      <Box
        key={username}
        alignSelf={username === currentUserName ? "flex-start" : "flex-end"}
        maxW="70%"
      >
        <Flex
          align="center"
          bg={username === currentUserName ? "blue.50" : "gray.50"}
          p={2}
          borderRadius="lg"
          gap={2}
        >
          {/* current user (You) -left side */}
          {username === currentUserName ? (
            <>
              <Avatar size="xs" name={username} />
              <Flex align="center" gap={1}>
                <Text fontSize="sm" color="gray.500" fontStyle="italic">
                  You are typing
                </Text>
                <Flex gap={1}>
                  {[1, 2, 3].map((dot) => (
                    <Box
                      key={dot}
                      w="3px"
                      h="3px"
                      borderRadius="full"
                      bg="gray.500"
                    />
                  ))}
                </Flex>
              </Flex>
            </>
          ) : (
            <>
              <Flex align="center" gap={1}>
                <Text fontSize="sm" color="gray.500" fontStyle="italic">
                  {username} is typing
                </Text>
                <Flex gap={1}>
                  {[1, 2, 3].map((dot) => (
                    <Box
                      key={dot}
                      w="3px"
                      h="3px"
                      borderRadius="full"
                      bg="gray.500"
                    />
                  ))}
                </Flex>
              </Flex>
              <Avatar size="xs" name={username} />
            </>
          )}
        </Flex>
      </Box>
    ));
  };
  return (
    <Flex
      h="100%"
      position="relative"
      direction={{ base: "column", lg: "row" }}
    >
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        bg="gray.50"
        maxW={{ base: "100%", lg: `calc(100% - 260px)` }}
      >
        {/* Chat Header */}
        {selectedGroup ? (
          <>
            <Flex
              px={6}
              py={4}
              bg="white"
              borderBottom="1px solid"
              borderColor="gray.200"
              align="center"
              boxShadow="sm"
            >
              <Button
                display={{ base: "inline-flex", md: "none" }}
                variant="ghost"
                mr={2}
                onClick={() => setSelectedGroup(null)}
              >
                ←
              </Button>
              <Icon
                as={FiMessageCircle}
                fontSize="24px"
                color="blue.500"
                mr={3}
              />
              <Box flex="1">
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  {selectedGroup.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {selectedGroup.description || "No description"}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  {selectedGroup.members?.length || 0} member
                  {selectedGroup.members?.length === 1 ? "" : "s"}
                </Text>
              </Box>
              <Icon
                as={FiInfo}
                fontSize="20px"
                color="gray.400"
                cursor="pointer"
                _hover={{ color: "blue.500" }}
              />
            </Flex>

            {/* Messages Area */}
            <VStack
              flex="1"
              overflowY="auto"
              spacing={4}
              align="stretch"
              px={6}
              py={4}
              position="relative"
              sx={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  width: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "gray.200",
                  borderRadius: "24px",
                },
              }}
            >
              {messages.length === 0 && typingUsers.size === 0 && (
                <Text color="gray.500" textAlign="center" py={8}>
                  No messages yet. Start the conversation.
                </Text>
              )}
              {messages.map((message) => (
                <Box
                  key={message._id}
                  alignSelf={
                    message.sender._id === currentUser?._id
                      ? "flex-start"
                      : "flex-end"
                  }
                  maxW="70%"
                >
                  <Flex direction="column" gap={1}>
                    <Flex
                      align="center"
                      mb={1}
                      justifyContent={
                        message.sender._id === currentUser?._id
                          ? "flex-start"
                          : "flex-end"
                      }
                      gap={2}
                    >
                      {message.sender._id === currentUser?._id ? (
                        <>
                          <Avatar
                            size="xs"
                            name={getUserName(message.sender)}
                          />
                          <Text fontSize="xs" color="gray.500">
                            You • {formatTime(message.createdAt)}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text fontSize="xs" color="gray.500">
                            {getUserName(message.sender)} •{" "}
                            {formatTime(message.createdAt)}
                          </Text>
                          <Avatar
                            size="xs"
                            name={getUserName(message.sender)}
                          />
                        </>
                      )}
                    </Flex>

                    <Box
                      bg={
                        message?.sender._id === currentUser?._id
                          ? "blue.500"
                          : "white"
                      }
                      color={
                        message?.sender._id === currentUser?._id
                          ? "white"
                          : "gray.800"
                      }
                      p={3}
                      borderRadius="lg"
                      boxShadow="sm"
                    >
                      <Text>{message.content}</Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
              {renderTypingIndicator()}
              <div ref={messagesEndRef} />
            </VStack>

            {/* Message Input */}
            <Box
              p={4}
              bg="white"
              borderTop="1px solid"
              borderColor="gray.200"
              position="relative"
              zIndex="1"
            >
              <InputGroup size="lg">
                <Input
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Type your message..."
                  pr="4.5rem"
                  bg="gray.50"
                  border="none"
                  _focus={{
                    boxShadow: "none",
                    bg: "gray.100",
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    colorScheme="blue"
                    borderRadius="full"
                    _hover={{
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.2s"
                    onClick={sendMessage}
                  >
                    <Icon as={FiSend} />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          </>
        ) : (
          <>
            <Flex
              h="100%"
              direction="column"
              align="center"
              justify="center"
              p={8}
              textAlign="center"
            >
              <Icon
                as={FiMessageCircle}
                fontSize="64px"
                color="gray.300"
                mb={4}
              />
              <Text fontSize="xl" fontWeight="medium" color="gray.500" mb={2}>
                Welcome to the Chat
              </Text>
              <Text color="gray.500" mb={2}>
                Select a group from the sidebar to start chatting
              </Text>
            </Flex>
          </>
        )}
      </Box>

      {/* UsersList with responsive width */}
      <Box
        width={{ base: "100%", lg: "260px" }}
        position={{ base: "static", lg: "sticky" }}
        right={0}
        top={0}
        height={{ base: "auto", lg: "100%" }}
        flexShrink={0}
        display={{ base: "none", lg: "block" }}
      >
        {selectedGroup && (
          <UsersList
            users={selectedGroup.members || []}
            onlineUserIds={connectedUsers.map((user) => user._id)}
          />
        )}
      </Box>
    </Flex>
  );
};

ChatArea.propTypes = {
  selectedGroup: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    members: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        userName: PropTypes.string,
        username: PropTypes.string,
      }),
    ),
  }),
  socket: PropTypes.shape({
    emit: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired,
  }).isRequired,
  setSelectedGroup: PropTypes.func.isRequired,
};

export default ChatArea;

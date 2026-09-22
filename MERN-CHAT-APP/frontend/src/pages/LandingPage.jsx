import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Flex,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import {
  FiMessageSquare,
  FiUsers,
  FiLock,
  FiUserPlus,
  FiGlobe,
  FiActivity,
  FiArrowUpRight,
  FiCheck,
  FiUserCheck,
} from "react-icons/fi";

const Feature = ({ title, text, icon, badges = [] }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      rounded="xl"
      p={6}
      spacing={4}
      border="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
      }}
      transition="all 0.3s ease"
    >
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="full"
        bg={useColorModeValue("blue.500", "blue.400")}
      >
        {icon}
      </Flex>
      <Box>
        <HStack spacing={2} mb={2}>
          <Text fontWeight={600} fontSize="lg">
            {title}
          </Text>
          {badges.map((badge, index) => (
            <Badge
              key={index}
              colorScheme={badge.color}
              variant="subtle"
              rounded="full"
              px={2}
            >
              {badge.text}
            </Badge>
          ))}
        </HStack>
        <Text color={useColorModeValue("gray.500", "gray.200")}>{text}</Text>
      </Box>
    </Stack>
  );
};

Feature.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      text: PropTypes.string,
    }),
  ),
};

const ChatMessage = ({ message, sender, time, isUser }) => {
  return (
    <Flex justify={isUser ? "flex-end" : "flex-start"} w="100%">
      <Box
        bg={isUser ? "blue.500" : "gray.100"}
        color={isUser ? "white" : "gray.800"}
        borderRadius="lg"
        px={4}
        py={2}
        maxW="80%"
      >
        <Text fontSize="sm" fontWeight="bold" mb={1}>
          {sender}
        </Text>
        <Text>{message}</Text>
        <Text
          fontSize="xs"
          color={isUser ? "whiteAlpha.700" : "gray.500"}
          mt={1}
        >
          {time}
        </Text>
      </Box>
    </Flex>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.string.isRequired,
  sender: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  isUser: PropTypes.bool.isRequired,
};

export default function LandingPage() {
  return (
    <Box bg="#0b0b0f" color="white" minH="100vh">
      {/* Hero Section */}
      <Container maxW="7xl" pt={10}>
        <Stack
          align="center"
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: "column", md: "row" }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Badge
              alignSelf="flex-start"
              px={3}
              py={1.5}
              borderRadius="full"
              bg="#202c1a"
              color="#d7ff64"
              fontSize="xs"
              letterSpacing="0.08em"
              textTransform="uppercase"
            >
              <Icon as={FiActivity} mr={2} /> Live conversations
            </Badge>
            <Heading
              fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
              lineHeight="0.98"
              letterSpacing="-0.055em"
              fontWeight="700"
            >
              Make space
              <br />
              <Text as="span" color="#d7ff64">
                for the good stuff.
              </Text>
            </Heading>
            <Text
              color="#a5abb0"
              fontSize={{ base: "lg", md: "xl" }}
              maxW="500px"
              lineHeight="1.65"
            >
              A focused place for your people to talk, share ideas, and stay in
              sync without the noise.
            </Text>
            <HStack spacing={4} pt={2} flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                px={7}
                bg="#d7ff64"
                color="#101112"
                rightIcon={<FiArrowUpRight />}
                _hover={{ bg: "#e2ff8b", transform: "translateY(-2px)" }}
                transition="all 0.2s ease"
              >
                Create your space
              </Button>
              <HStack color="#8e959b" fontSize="sm" spacing={2}>
                <Icon as={FiCheck} color="#d7ff64" />
                <Text>Free to get started</Text>
              </HStack>
            </HStack>
          </Stack>

          {/* Chat Preview */}
          <Flex
            flex={1}
            justify="center"
            align="center"
            position="relative"
            w="full"
          >
            <Box
              position="relative"
              height="500px"
              rounded="2xl"
              boxShadow="2xl"
              width="full"
              overflow="hidden"
              bg="#151518"
              border="1px"
              borderColor="#38383a"
            >
              {/* Chat Header */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bg="blue.500"
                p={4}
                color="white"
                borderBottom="1px"
                borderColor="blue.600"
              >
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiUsers} />
                    <Text fontWeight="bold">Team MasynTech</Text>
                  </HStack>
                  <HStack spacing={4}>
                    <Badge colorScheme="green" variant="solid">
                      3 online
                    </Badge>
                    <Icon as={FiGlobe} />
                  </HStack>
                </HStack>
              </Box>

              {/* Chat Messages */}
              <VStack
                spacing={4}
                p={4}
                pt="60px"
                h="calc(100% - 120px)"
                overflowY="auto"
              >
                <ChatMessage
                  sender="Henry Smith"
                  message="Hey team! Just pushed the new updates to staging."
                  time="9:30 PM"
                  isUser={false}
                />
                <ChatMessage
                  sender="Joe Roberts"
                  message="Great work! The new features look amazing 🚀"
                  time="9:31 PM"
                  isUser={false}
                />
                <ChatMessage
                  sender="You"
                  message="Thanks! Let's review it in our next standup."
                  time="9:32 PM"
                  isUser={true}
                />
                <Box w="100%" textAlign="center">
                  <Badge colorScheme="gray" fontSize="xs">
                    Henry is typing...
                  </Badge>
                </Box>
              </VStack>
            </Box>
          </Flex>
        </Stack>

        {/* Features Grid */}
        <Box py={20}>
          <VStack spacing={2} textAlign="center" mb={12}>
            <Heading fontSize="4xl">Powerful Features</Heading>
            <Text fontSize="lg" color="gray.300">
              Everything you need for seamless team collaboration
            </Text>
          </VStack>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={10}
            px={{ base: 4, md: 8 }}
          >
            <Feature
              icon={<Icon as={FiLock} w={10} h={10} />}
              title="Secure Authentication"
              badges={[{ text: "Secure", color: "green" }]}
              text="Register and login securely with email verification and encrypted passwords."
            />
            <Feature
              icon={<Icon as={FiUsers} w={10} h={10} />}
              title="Group Management"
              badges={[{ text: "Real-time", color: "blue" }]}
              text="Create, join, or leave groups easily. Manage multiple conversations in one place."
            />
            <Feature
              icon={<Icon as={FiUserCheck} w={10} h={10} />}
              title="Online Presence"
              badges={[{ text: "Live", color: "green" }]}
              text="See who's currently online and active in your groups in real-time."
            />
            <Feature
              icon={<Icon as={FiActivity} w={10} h={10} />}
              title="Typing Indicators"
              badges={[{ text: "Interactive", color: "purple" }]}
              text="Know when others are typing with real-time typing indicators."
            />
            <Feature
              icon={<Icon as={FiMessageSquare} w={10} h={10} />}
              title="Instant Messaging"
              badges={[{ text: "Fast", color: "orange" }]}
              text="Send and receive messages instantly with real-time delivery and notifications."
            />
            <Feature
              icon={<Icon as={FiGlobe} w={10} h={10} />}
              title="Global Access"
              badges={[{ text: "24/7", color: "blue" }]}
              text="Access your chats from anywhere, anytime with persistent connections."
            />
          </SimpleGrid>
        </Box>

        {/* Call to Action */}
        <Box py={20}>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={10}
            align="center"
            justify="center"
            bg="#151518"
            border="1px solid"
            borderColor="#38383a"
            p={10}
            rounded="xl"
          >
            <VStack align="flex-start" spacing={4}>
              <Heading size="lg">Ready to get started?</Heading>
              <Text color="gray.300" fontSize="lg">
                Join thousands of users already using our platform
              </Text>
            </VStack>
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              colorScheme="blue"
              rightIcon={<FiUserPlus />}
            >
              Create Free Account
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

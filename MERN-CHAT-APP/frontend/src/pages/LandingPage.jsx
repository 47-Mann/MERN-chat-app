import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  Icon,
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

const Feature = ({ title, text, icon, number, badges = [] }) => {
  return (
    <Stack
      bg="#151518"
      borderRadius="8px"
      p={{ base: 5, md: 6 }}
      minH="235px"
      justify="space-between"
      spacing={6}
      border="1px solid"
      borderColor="#38383a"
      _hover={{
        transform: "translateY(-5px)",
        borderColor: "blue.500",
        boxShadow: "0 18px 40px rgba(0, 0, 0, 0.24)",
      }}
      transition="transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
    >
      <HStack justify="space-between" align="flex-start">
        <Flex
          w="44px"
          h="44px"
          align="center"
          justify="center"
          color="white"
          borderRadius="6px"
          bg="blue.600"
        >
          {icon}
        </Flex>
        <Text color="blue.300" fontSize="sm" fontWeight="700">
          {number}
        </Text>
      </HStack>
      <Box>
        <HStack spacing={2} mb={3} flexWrap="wrap">
          <Text fontWeight={700} fontSize="lg">
            {title}
          </Text>
          {badges.map((badge, index) => (
            <Badge
              key={index}
              colorScheme={badge.color}
              variant="outline"
              rounded="full"
              px={2}
              fontSize="10px"
            >
              {badge.text}
            </Badge>
          ))}
        </HStack>
        <Text color="gray.400" lineHeight="1.7">
          {text}
        </Text>
      </Box>
    </Stack>
  );
};

Feature.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  number: PropTypes.string.isRequired,
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
              bg="blue.900"
              color="blue.200"
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
              <Text as="span" color="blue.400">
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
                bg="blue.500"
                color="white"
                rightIcon={<FiArrowUpRight />}
                _hover={{ bg: "blue.600", transform: "translateY(-2px)" }}
                transition="all 0.2s ease"
              >
                Create your space
              </Button>
              <HStack color="#8e959b" fontSize="sm" spacing={2}>
                <Icon as={FiCheck} color="blue.400" />
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
                    <Text fontWeight="bold">Team Chat</Text>
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
                  message="Great! I'll review them and provide feedback."
                  time="9:31 PM"
                  isUser={false}
                />
                <ChatMessage
                  sender="You"
                  message="Thanks, Henry! I'll check it out now."
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
          <Flex
            justify="space-between"
            align={{ base: "flex-start", md: "flex-end" }}
            direction={{ base: "column", md: "row" }}
            gap={5}
            mb={10}
          >
            <Box>
              <Text
                color="blue.400"
                fontSize="sm"
                fontWeight="700"
                letterSpacing="0.12em"
                mb={3}
              >
                BUILT FOR BETTER CONVERSATIONS
              </Text>
              <Heading fontSize={{ base: "3xl", md: "4xl" }}>
                Everything in the room.
              </Heading>
            </Box>
            <Text color="gray.400" maxW="330px" lineHeight="1.7">
              The tools you need to keep your people close and your work moving.
            </Text>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <Feature
              icon={<Icon as={FiLock} w={10} h={10} />}
              number="01"
              title="Secure Authentication"
              badges={[{ text: "Protected", color: "blue" }]}
              text="Protected sign-up and login keep each conversation available to the right people."
            />
            <Feature
              icon={<Icon as={FiUsers} w={10} h={10} />}
              number="02"
              title="Group Management"
              badges={[{ text: "Real-time", color: "blue" }]}
              text="Create, join, or leave focused groups and keep every conversation in its own space."
            />
            <Feature
              icon={<Icon as={FiUserCheck} w={10} h={10} />}
              number="03"
              title="Online Presence"
              badges={[{ text: "Live", color: "blue" }]}
              text="See who is around and catch the rhythm of your group as it happens."
            />
            <Feature
              icon={<Icon as={FiActivity} w={10} h={10} />}
              number="04"
              title="Typing Indicators"
              badges={[{ text: "Interactive", color: "blue" }]}
              text="Know when a reply is on its way with lightweight live typing updates."
            />
            <Feature
              icon={<Icon as={FiMessageSquare} w={10} h={10} />}
              number="05"
              title="Instant Messaging"
              badges={[{ text: "Fast", color: "blue" }]}
              text="Send updates instantly with real-time delivery and clear message history."
            />
            <Feature
              icon={<Icon as={FiGlobe} w={10} h={10} />}
              number="06"
              title="Global Access"
              badges={[{ text: "24/7", color: "blue" }]}
              text="Stay connected across screens with a responsive experience built for anywhere."
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

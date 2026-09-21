import {
  Box,
  VStack,
  Text,
  Badge,
  Flex,
  Icon,
  Tooltip,
  Avatar,
} from "@chakra-ui/react";
import { FiUsers, FiCircle } from "react-icons/fi";
import PropTypes from "prop-types";

const UsersList = ({ users, onlineUserIds }) => {
  const getUserName = (user) => user?.userName || user?.username || "User";

  return (
    <Box
      h="100%"
      w="100%"
      borderLeft="1px solid"
      borderColor="gray.200"
      bg="white"
      position="relative"
      overflow="hidden"
    >
      {/* Header */}
      <Flex
        p={5}
        borderBottom="1px solid"
        borderColor="gray.200"
        bg="white"
        align="center"
        position="sticky"
        top={0}
        zIndex={1}
        boxShadow="sm"
      >
        <Icon as={FiUsers} fontSize="20px" color="blue.500" mr={2} />
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Members
        </Text>
        <Badge
          ml={2}
          colorScheme="blue"
          borderRadius="full"
          px={2}
          py={0.5}
          fontSize="xs"
        >
          {users.length}
        </Badge>
      </Flex>

      {/* Users List */}
      <Box flex="1" overflowY="auto" p={4}>
        {users.length === 0 ? (
          <Text color="gray.500" textAlign="center" py={4}>
            No members in this group.
          </Text>
        ) : (
          <VStack align="stretch" spacing={3}>
            {users.map((user) => {
              const isOnline = onlineUserIds.includes(user._id);

              return (
                <Box key={user._id}>
                  <Tooltip
                    label={`${getUserName(user)} is ${isOnline ? "online" : "offline"}`}
                    placement="left"
                  >
                    <Flex
                      p={3}
                      bg="white"
                      borderRadius="lg"
                      shadow="sm"
                      align="center"
                      borderWidth="1px"
                      borderColor="gray.100"
                    >
                      <Avatar
                        size="sm"
                        name={getUserName(user)}
                        bg="blue.500"
                        color="white"
                        mr={3}
                      />
                      <Box flex="1">
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.700"
                          noOfLines={1}
                        >
                          {getUserName(user)}
                        </Text>
                      </Box>
                      <Flex
                        align="center"
                        bg={isOnline ? "green.50" : "gray.50"}
                        px={2}
                        py={1}
                        borderRadius="full"
                      >
                        <Icon
                          as={FiCircle}
                          color={isOnline ? "green.400" : "gray.400"}
                          fontSize="8px"
                          mr={1}
                        />
                        <Text
                          fontSize="xs"
                          color={isOnline ? "green.600" : "gray.500"}
                          fontWeight="medium"
                        >
                          {isOnline ? "online" : "offline"}
                        </Text>
                      </Flex>
                    </Flex>
                  </Tooltip>
                </Box>
              );
            })}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

UsersList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      userName: PropTypes.string,
      username: PropTypes.string,
    }),
  ).isRequired,
  onlineUserIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UsersList;

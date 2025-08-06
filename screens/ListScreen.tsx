import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getAllBucketItems, deleteBucketItem } from "../services/DbService";

const ListScreen = () => {
  const navigation: any = useNavigation();
  const [bucketItems, setBucketItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const goToAdd = () => {
    navigation.navigate("Add");
  };

  const fetchBucketItems = async () => {
    try {
      setLoading(true);
      const items = await getAllBucketItems();
      setBucketItems(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to load bucket list items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert("Delete Item", `Are you sure you want to delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteBucketItem(id);
            fetchBucketItems(); // Refresh the list
          } catch (error) {
            Alert.alert("Error", "Failed to delete item");
          }
        },
      },
    ]);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBucketItems();
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.card, item.isCompleted && styles.completedCard]}
      onPress={() => navigation.navigate("Details", { item })}
      onLongPress={() => handleDelete(item.id, item.title)}
    >
      <View style={styles.cardContent}>
        <Text
          style={[styles.cardTitle, item.isCompleted && styles.completedText]}
        >
          {item.title}
        </Text>
        {item.due && <Text style={styles.dueDate}>Due: {item.due}</Text>}
        {item.isCompleted && (
          <Text style={styles.completedLabel}>✓ Completed</Text>
        )}
      </View>
      <View style={styles.cardIcons}>
        {item.priority && <AntDesign name="star" size={24} color="orange" />}
        {item.isCompleted && <AntDesign name="check" size={24} color="green" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable style={styles.addButton} onPress={goToAdd}>
          <Text style={styles.addButtonText}>Add</Text>
          <Entypo name="bucket" size={16} color="green" />
        </Pressable>

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : bucketItems.length === 0 ? (
          <Text style={styles.emptyText}>
            No bucket list items yet. Add one above!
          </Text>
        ) : (
          <FlatList
            data={bucketItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 20,
    flex: 1,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  completedCard: {
    backgroundColor: "#f0f8f0",
    opacity: 0.8,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#666",
  },
  dueDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  completedLabel: {
    fontSize: 12,
    color: "green",
    fontWeight: "bold",
  },
  cardIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addButton: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
});

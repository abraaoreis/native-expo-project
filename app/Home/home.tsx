import { useHome, type Instrument } from "@/hooks/useHome";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Home() {
  const router = useRouter();
  const { instruments, loadMore, hasMore } = useHome();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Inicio</Text>
        <Pressable
          onPress={() => router.replace("/Login")}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Salir</Text>
        </Pressable>
      </View>

      <FlatList
        data={instruments}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        initialNumToRender={10}
        renderItem={({ item }) => (
          <InstrumentItem
            item={item}
            onPress={() => {
              setSelectedInstrument(item);
              setModalVisible(true);
            }}
          />
        )}
        ListFooterComponent={() => (
          <Text style={styles.footerText}>
            {hasMore ? "Cargando más..." : "Todos los elementos cargados"}
          </Text>
        )}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedInstrument && (
              <>
                <Text style={styles.modalTitle}>Detalles del Instrumento</Text>
                <Image
                  source={{ uri: selectedInstrument.image }}
                  style={styles.modalCover}
                />
                <Text style={styles.modalText}>
                  Nombre: {selectedInstrument.name}
                </Text>
                <Text style={styles.modalText}>
                  Tipo: {selectedInstrument.type}
                </Text>
                <Text style={styles.modalText}>
                  Marca: {selectedInstrument.brand}
                </Text>
                <Text style={styles.modalText}>
                  Precio: {selectedInstrument.price}
                </Text>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeText}>Cerrar</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function InstrumentItem({
  item,
  onPress,
}: {
  item: Instrument;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.cover} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.info}>
          {item.type} • {item.brand}
        </Text>
        <Text style={styles.info}>Preço: {item.price}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1f1f1f",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#db052c",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  list: {
    padding: 12,
  },
  itemCard: {
    backgroundColor: "#252525",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cover: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  info: {
    color: "#ccc",
    marginTop: 4,
    fontSize: 13,
  },
  footerText: {
    textAlign: "center",
    color: "#aaa",
    padding: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#252525",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalCover: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: "#db052c",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

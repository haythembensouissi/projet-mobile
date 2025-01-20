import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firebase } from '../../firebase/db';

export default function Page() {
  const { id, userid } = useLocalSearchParams();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [userData, setUser] = useState({
    email: '',
    username: '',
    role: '',
    id: '',
  });
  const router = useRouter();

  const getUser = () => {
    const usersRef = firebase.firestore().collection('users');

    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        await usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            if (document.exists) {
              const data = document.data() || {};
              setUser({
                id: document.id,
                email: data.email || '',
                username: data.username || '',
                role: data.role || '',
              });
            } else {
              console.warn('No user document found.');
            }
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      }
    });
  };

  const ref = firebase.firestore().collection('emprunt');

  useEffect(() => {
    getUser();
  }, []);

  const handlesubmit = async () => {
    const dateemprunt = new Date(Date.now()).toLocaleDateString();
    await ref.add({
      userid: userData.id,
      dateretour: date.toLocaleDateString(),
      bookid: id,
      dateemprunt: dateemprunt,
      status: 'emprunté',
    });
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisir une date de retour</Text>
      <Button title="Choisir la date de retour" onPress={() => setOpen(true)} />
      {open && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setOpen(false);
            setDate(currentDate);
          }}
        />
      )}
      <Text style={styles.selectedDate}>Date sélectionnée : {date.toDateString()}</Text>
      <Button title="Confirmer l'emprunt" onPress={handlesubmit} color="#00B2FF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  selectedDate: {
    fontSize: 16,
    marginVertical: 15,
    color: '#555',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00B2FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

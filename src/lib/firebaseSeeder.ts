import { db, collection, getDocs, setDoc, doc, addDoc } from '../firebase';

export async function seedInitialStadiumData() {
  try {
    // 1. Seed Remote Config parameters
    const configRef = doc(db, 'remote_config', 'stadium_settings');
    const configSnap = await getDocs(collection(db, 'remote_config'));
    if (configSnap.empty) {
      await setDoc(configRef, {
        ticketSaleDiscount: 0,
        coolingHvacThreshold: 22,
        biometricScanDelay: 2.4,
        emergencyLockdown: false,
        gateAOverflowEnabled: false,
        lastUpdated: new Date().toISOString()
      });
      console.log('Seeded remote_config collection.');
    }

    // 2. Seed Stadium Gates
    const gatesSnap = await getDocs(collection(db, 'stadium_gates'));
    if (gatesSnap.empty) {
      const gates = [
        { id: 'gate-a', name: 'Gate A (North Entrance)', occupancy: 42, waitTime: '4 min', status: 'low', flowRate: '120/min', order: 1 },
        { id: 'gate-b', name: 'Gate B (East Concourse)', occupancy: 65, waitTime: '9 min', status: 'medium', flowRate: '180/min', order: 2 },
        { id: 'gate-c', name: 'Gate C (South Main)', occupancy: 35, waitTime: '2 min', status: 'low', flowRate: '85/min', order: 3 },
        { id: 'gate-d', name: 'Gate D (VIP & Media)', occupancy: 18, waitTime: '1 min', status: 'low', flowRate: '30/min', order: 4 },
      ];
      for (const gate of gates) {
        await setDoc(doc(db, 'stadium_gates', gate.id), gate);
      }
      console.log('Seeded stadium_gates collection.');
    }

    // 3. Seed Volunteer Tasks
    const tasksSnap = await getDocs(collection(db, 'volunteer_tasks'));
    if (tasksSnap.empty) {
      const tasks = [
        { title: 'Assist visually impaired spectator', location: 'Gate A (North Entrance)', urgency: 'high', status: 'pending', createdAt: new Date().toISOString() },
        { title: 'Replenish bottled water station', location: 'Section 114 (Concourse Corridor 4)', urgency: 'medium', status: 'pending', createdAt: new Date().toISOString() },
        { title: 'Resolve ticket scanner delay', location: 'Gate B (East Concourse)', urgency: 'high', status: 'pending', createdAt: new Date().toISOString() },
        { title: 'Distribute spectator rain ponchos', location: 'Gate C (South Main)', urgency: 'low', status: 'completed', createdAt: new Date().toISOString() },
      ];
      for (const t of tasks) {
        await addDoc(collection(db, 'volunteer_tasks'), t);
      }
      console.log('Seeded volunteer_tasks collection.');
    }

    // 4. Seed Safety Broadcasts
    const broadcastSnap = await getDocs(collection(db, 'safety_broadcasts'));
    if (broadcastSnap.empty) {
      const broadcasts = [
        { text: 'SPECTATOR BRIEFING: Please prepare physical ticketing barcodes prior to Gate arrival.', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { text: 'WEATHER ADVISORY: Temperatures expected to drop; climate-stadium airflow adjusted.', timestamp: new Date(Date.now() - 7200000).toISOString() }
      ];
      for (const b of broadcasts) {
        await addDoc(collection(db, 'safety_broadcasts'), b);
      }
      console.log('Seeded safety_broadcasts collection.');
    }

    // 5. Seed initial Cloud Storage simulator catalog
    const storageSnap = await getDocs(collection(db, 'cloud_storage_metadata'));
    if (storageSnap.empty) {
      const items = [
        { name: 'gate_b_ingress_flow_cam.mp4', size: '4.2 MB', contentType: 'video/mp4', category: 'Security Logs', uploadedBy: 'Ops System', downloadUrl: '#' },
        { name: 'stadium_layout_blueprint.pdf', size: '12.8 MB', contentType: 'application/pdf', category: 'Architectural Maps', uploadedBy: 'Facilities Admin', downloadUrl: '#' },
        { name: 'arabic_ocr_signage_sample_1.png', size: '1.4 MB', contentType: 'image/png', category: 'OCR Models', uploadedBy: 'Volunteer Translation Suite', downloadUrl: '#' }
      ];
      for (const item of items) {
        await addDoc(collection(db, 'cloud_storage_metadata'), item);
      }
      console.log('Seeded cloud_storage_metadata collection.');
    }

    // 6. Seed Analytics
    const analyticsSnap = await getDocs(collection(db, 'analytics_events'));
    if (analyticsSnap.empty) {
      const events = [
        { eventName: 'user_login', category: 'Authentication', timestamp: new Date(Date.now() - 600000).toISOString(), userEmail: 'admin@lusail.qa' },
        { eventName: 'ocr_translation_triggered', category: 'OCR Translator', timestamp: new Date(Date.now() - 500000).toISOString(), userEmail: 'steward.02@lusail.qa' },
        { eventName: 'sustainability_action', category: 'Environment', timestamp: new Date(Date.now() - 400000).toISOString(), userEmail: 'spectator.99@gmail.com' }
      ];
      for (const e of events) {
        await addDoc(collection(db, 'analytics_events'), e);
      }
      console.log('Seeded analytics_events collection.');
    }

    // 7. Seed Messaging
    const msgsSnap = await getDocs(collection(db, 'messaging_alerts'));
    if (msgsSnap.empty) {
      const msgs = [
        { text: 'Volunteer alert: Heavy density at gate B, standby for dispatch', urgency: 'high', sentAt: new Date().toISOString() }
      ];
      for (const m of msgs) {
        await addDoc(collection(db, 'messaging_alerts'), m);
      }
    }
  } catch (err) {
    console.error('Error seeding initial Firebase data:', err);
  }
}

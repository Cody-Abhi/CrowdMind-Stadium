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

    // 2. Seed Plant Inflow Inlets
    const gatesSnap = await getDocs(collection(db, 'stadium_gates'));
    if (gatesSnap.empty) {
      const gates = [
        { id: 'gate-a', name: 'Inlet A (North Pipe)', occupancy: 42, waitTime: '4 min', status: 'low', flowRate: '120/min', order: 1 },
        { id: 'gate-b', name: 'Inlet B (East Pipe)', occupancy: 65, waitTime: '9 min', status: 'medium', flowRate: '180/min', order: 2 },
        { id: 'gate-c', name: 'Inlet C (South Pipe)', occupancy: 35, waitTime: '2 min', status: 'low', flowRate: '85/min', order: 3 },
        { id: 'gate-d', name: 'Inlet D (VIP Bypass Pipe)', occupancy: 18, waitTime: '1 min', status: 'low', flowRate: '30/min', order: 4 },
      ];
      for (const gate of gates) {
        await setDoc(doc(db, 'stadium_gates', gate.id), gate);
      }
      console.log('Seeded stadium_gates (inlets) collection.');
    }

    // 3. Seed Maintenance Work Orders
    const tasksSnap = await getDocs(collection(db, 'volunteer_tasks'));
    if (tasksSnap.empty) {
      const tasks = [
        { title: 'Check Compressor C-204 bearing vibration', location: 'Sector E (East Wing)', urgency: 'high', status: 'pending', createdAt: new Date().toISOString() },
        { title: 'Perform oil flush on Pump P-101', location: 'Sector W (West Wing)', urgency: 'medium', status: 'pending', createdAt: new Date().toISOString() },
        { title: 'Flush tube bundle on Exchanger E-105', location: 'Sector N (North Wing)', urgency: 'high', status: 'pending', createdAt: new Date().toISOString() },
        { title: 'Verify pressure gauge calibration on Line L-42', location: 'Sector S (South Wing)', urgency: 'low', status: 'completed', createdAt: new Date().toISOString() },
      ];
      for (const t of tasks) {
        await addDoc(collection(db, 'volunteer_tasks'), t);
      }
      console.log('Seeded volunteer_tasks (work orders) collection.');
    }

    // 4. Seed Safety Advisory Beacons
    const broadcastSnap = await getDocs(collection(db, 'safety_broadcasts'));
    if (broadcastSnap.empty) {
      const broadcasts = [
        { text: 'CRITICAL ADVISORY: Compressor C-204 bearing temperature high, standby for dispatch.', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { text: 'COMPLIANCE ALERT: All engineers must review emergency depressurization SOP-11.', timestamp: new Date(Date.now() - 7200000).toISOString() }
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
        { name: 'c204_compressor_oem_spec.pdf', size: '14.2 MB', contentType: 'application/pdf', category: 'OEM Manuals', uploadedBy: 'Ops System', downloadUrl: '#' },
        { name: 'plant_layout_blueprint.dwg', size: '12.8 MB', contentType: 'image/vnd.dwg', category: 'P&ID Drawings', uploadedBy: 'Facilities Admin', downloadUrl: '#' },
        { name: 'emergency_depressurization_sop11.pdf', size: '1.4 MB', contentType: 'application/pdf', category: 'SOP Procedures', uploadedBy: 'Safety Officer', downloadUrl: '#' }
      ];
      for (const item of items) {
        await addDoc(collection(db, 'cloud_storage_metadata'), item);
      }
      console.log('Seeded cloud_storage_metadata collection.');
    }

    // 6. Seed Analytics Audit
    const analyticsSnap = await getDocs(collection(db, 'analytics_events'));
    if (analyticsSnap.empty) {
      const events = [
        { eventName: 'user_login', category: 'Authentication', timestamp: new Date(Date.now() - 600000).toISOString(), userEmail: 'engineer@lusail.gov.qa' },
        { eventName: 'rag_query_triggered', category: 'RAG Operations', timestamp: new Date(Date.now() - 500000).toISOString(), userEmail: 'operator.02@lusail.gov.qa' },
        { eventName: 'safety_action_inhibit', category: 'Security Rules', timestamp: new Date(Date.now() - 400000).toISOString(), userEmail: 'auditor.99@lusail.gov.qa' }
      ];
      for (const e of events) {
        await addDoc(collection(db, 'analytics_events'), e);
      }
      console.log('Seeded analytics_events collection.');
    }

    // 7. Seed Messaging Alerts
    const msgsSnap = await getDocs(collection(db, 'messaging_alerts'));
    if (msgsSnap.empty) {
      const msgs = [
        { text: 'Plant alert: High vibration threshold on C-204, standby for maintenance', urgency: 'high', sentAt: new Date().toISOString() }
      ];
      for (const m of msgs) {
        await addDoc(collection(db, 'messaging_alerts'), m);
      }
    }
  } catch (err) {
    console.error('Error seeding initial Firebase data:', err);
  }
}

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Firestore reference
const db = admin.firestore();

// Auth reference
const auth = admin.auth();

// Trigger: When a new manual is created
exports.onManualCreate = functions.firestore
  .document('manuals/{manualId}')
  .onCreate(async (snap, context) => {
    const manual = snap.data();
    const manualId = context.params.manualId;

    // Check if status is 'pending_approval'
    if (manual.status === 'pending_approval') {
      // Get all admin users
      const adminsSnapshot = await db.collection('users')
        .where('role', '==', 'admin')
        .get();

      const adminEmails = [];
      adminsSnapshot.forEach(doc => {
        const user = doc.data();
        if (user.email) {
          adminEmails.push(user.email);
        }
      });

      // Log notification (in production, send email or push notification)
      console.log(`New manual "${manual.title}" requires approval. Notify admins:`, adminEmails);

      // TODO: Integrate with email service (e.g., SendGrid, Firebase Extensions)
      // For now, just log the notification
      functions.logger.info('Manual approval notification', {
        manualId,
        title: manual.title,
        authorId: manual.authorId,
        adminEmails
      });
    }

    return null;
  });

// Callable Function: Approve a manual (admin only)
exports.approveManual = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to approve manuals.'
    );
  }

  const { manualId } = data;

  if (!manualId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Manual ID is required.'
    );
  }

  try {
    // Get user document to check role
    const userDoc = await db.collection('users').doc(context.auth.uid).get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'User document not found.'
      );
    }

    const user = userDoc.data();

    if (user.role !== 'admin') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only admins can approve manuals.'
      );
    }

    // Update manual status
    await db.collection('manuals').doc(manualId).update({
      status: 'published',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    functions.logger.info('Manual approved', { manualId, approvedBy: context.auth.uid });

    return { success: true, message: 'Manual approved successfully.' };

  } catch (error) {
    functions.logger.error('Error approving manual', { error, manualId });
    throw new functions.https.HttpsError('internal', 'Failed to approve manual.');
  }
});

// Callable Function: Increment view count
exports.incrementViewCount = functions.https.onCall(async (data, context) => {
  const { manualId } = data;

  if (!manualId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Manual ID is required.'
    );
  }

  try {
    // Use transaction to atomically increment the view count
    await db.runTransaction(async (transaction) => {
      const manualRef = db.collection('manuals').doc(manualId);
      const manualDoc = await transaction.get(manualRef);

      if (!manualDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'Manual not found.'
        );
      }

      const currentViews = manualDoc.data().stats?.views || 0;
      transaction.update(manualRef, {
        'stats.views': currentViews + 1,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    return { success: true };

  } catch (error) {
    functions.logger.error('Error incrementing view count', { error, manualId });
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to increment view count.');
  }
});

// Trigger: When a new user is created via Firebase Auth
exports.onUserCreate = functions.auth
  .user()
  .onCreate(async (user) => {
    try {
      // Create user document in Firestore
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        avatarUrl: user.photoURL || '',
        role: 'user', // Default role
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      functions.logger.info('User document created', { uid: user.uid, email: user.email });

    } catch (error) {
      functions.logger.error('Error creating user document', { error, uid: user.uid });
      // Note: This might cause issues if the function fails, but Firebase will retry
    }

    return null;
  });

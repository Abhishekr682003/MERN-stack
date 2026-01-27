#!/bin/bash

# ============================================================================
# Limited Edition Access API - Testing & Example Commands
# ============================================================================
# Run these commands to test the backend API
# Make sure the backend server is running: npm start

API_URL="http://localhost:5000/api"

echo "============================================================"
echo "Limited Edition Access - API Testing Guide"
echo "============================================================"
echo ""

# ============================================================================
# 1. HEALTH CHECK
# ============================================================================
echo "1. Testing Health Check..."
echo "Command: GET /health"
echo ""
curl -s "$API_URL/health" | python -m json.tool
echo ""
echo ""

# ============================================================================
# 2. GET EMPTY WAITLIST (Initial)
# ============================================================================
echo "2. Fetching Initial Waitlist..."
echo "Command: GET /waitlist"
echo ""
curl -s "$API_URL/waitlist" | python -m json.tool
echo ""
echo ""

# ============================================================================
# 3. ADD CUSTOMER 1 TO WAITLIST
# ============================================================================
echo "3. Adding Customer 1 to Waitlist..."
echo "Command: POST /waitlist"
echo ""
RESPONSE=$(curl -s -X POST "$API_URL/waitlist" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "name": "Alice Johnson",
    "productId": "limited-edition-2024"
  }')

echo "$RESPONSE" | python -m json.tool

# Extract the ID for later use
CUSTOMER_1_ID=$(echo "$RESPONSE" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Saved Customer ID: $CUSTOMER_1_ID"
echo ""
echo ""

# ============================================================================
# 4. ADD CUSTOMER 2 TO WAITLIST
# ============================================================================
echo "4. Adding Customer 2 to Waitlist..."
echo "Command: POST /waitlist"
echo ""
RESPONSE=$(curl -s -X POST "$API_URL/waitlist" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "name": "Bob Smith",
    "productId": "limited-edition-2024"
  }')

echo "$RESPONSE" | python -m json.tool

CUSTOMER_2_ID=$(echo "$RESPONSE" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Saved Customer ID: $CUSTOMER_2_ID"
echo ""
echo ""

# ============================================================================
# 5. ADD CUSTOMER 3 TO WAITLIST
# ============================================================================
echo "5. Adding Customer 3 to Waitlist..."
echo "Command: POST /waitlist"
echo ""
curl -s -X POST "$API_URL/waitlist" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "charlie@example.com",
    "name": "Charlie Brown",
    "productId": "limited-edition-2024"
  }' | python -m json.tool
echo ""
echo ""

# ============================================================================
# 6. GET ALL WAITLIST ENTRIES
# ============================================================================
echo "6. Fetching All Waitlist Entries..."
echo "Command: GET /waitlist"
echo ""
curl -s "$API_URL/waitlist" | python -m json.tool
echo ""
echo ""

# ============================================================================
# 7. FILTER BY STATUS - PENDING
# ============================================================================
echo "7. Filtering Waitlist by Status (Pending)..."
echo "Command: GET /waitlist?status=Pending"
echo ""
curl -s "$API_URL/waitlist?status=Pending" | python -m json.tool
echo ""
echo ""

# ============================================================================
# 8. FILTER BY PRODUCT ID
# ============================================================================
echo "8. Filtering Waitlist by Product ID..."
echo "Command: GET /waitlist?productId=limited-edition-2024"
echo ""
curl -s "$API_URL/waitlist?productId=limited-edition-2024" | python -m json.tool
echo ""
echo ""

# ============================================================================
# 9. GET SINGLE ENTRY (if we have an ID)
# ============================================================================
if [ ! -z "$CUSTOMER_1_ID" ]; then
  echo "9. Getting Single Entry..."
  echo "Command: GET /waitlist/$CUSTOMER_1_ID"
  echo ""
  curl -s "$API_URL/waitlist/$CUSTOMER_1_ID" | python -m json.tool
  echo ""
  echo ""
fi

# ============================================================================
# 10. UPDATE STATUS - APPROVE CUSTOMER 1
# ============================================================================
if [ ! -z "$CUSTOMER_1_ID" ]; then
  echo "10. Updating Customer 1 Status to Approved..."
  echo "Command: PUT /waitlist/$CUSTOMER_1_ID"
  echo ""
  curl -s -X PUT "$API_URL/waitlist/$CUSTOMER_1_ID" \
    -H "Content-Type: application/json" \
    -d '{"status": "Approved"}' | python -m json.tool
  echo ""
  echo ""
fi

# ============================================================================
# 11. UPDATE STATUS - REJECT CUSTOMER 2
# ============================================================================
if [ ! -z "$CUSTOMER_2_ID" ]; then
  echo "11. Updating Customer 2 Status to Rejected..."
  echo "Command: PUT /waitlist/$CUSTOMER_2_ID"
  echo ""
  curl -s -X PUT "$API_URL/waitlist/$CUSTOMER_2_ID" \
    -H "Content-Type: application/json" \
    -d '{"status": "Rejected"}' | python -m json.tool
  echo ""
  echo ""
fi

# ============================================================================
# 12. GET STATISTICS
# ============================================================================
echo "12. Getting Waitlist Statistics..."
echo "Command: GET /waitlist/stats/summary"
echo ""
curl -s "$API_URL/waitlist/stats/summary" | python -m json.tool
echo ""
echo ""

# ============================================================================
# 13. PAGINATION TEST
# ============================================================================
echo "13. Testing Pagination (Page 1, Limit 2)..."
echo "Command: GET /waitlist?page=1&limit=2"
echo ""
curl -s "$API_URL/waitlist?page=1&limit=2" | python -m json.tool
echo ""
echo ""

# ============================================================================
# 14. COMBINED FILTERING
# ============================================================================
echo "14. Combined Filter: Status=Approved & ProductId=limited-edition-2024"
echo "Command: GET /waitlist?status=Approved&productId=limited-edition-2024"
echo ""
curl -s "$API_URL/waitlist?status=Approved&productId=limited-edition-2024" | python -m json.tool
echo ""
echo ""

# ============================================================================
# 15. TEST DUPLICATE EMAIL (Should Fail)
# ============================================================================
echo "15. Testing Duplicate Email Prevention (Should Fail)..."
echo "Command: POST /waitlist with duplicate email"
echo ""
curl -s -X POST "$API_URL/waitlist" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "name": "Alice Johnson 2",
    "productId": "limited-edition-2024"
  }' | python -m json.tool
echo ""
echo ""

# ============================================================================
# 16. TEST INVALID EMAIL (Should Fail)
# ============================================================================
echo "16. Testing Invalid Email Validation (Should Fail)..."
echo "Command: POST /waitlist with invalid email"
echo ""
curl -s -X POST "$API_URL/waitlist" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "name": "Invalid User",
    "productId": "limited-edition-2024"
  }' | python -m json.tool
echo ""
echo ""

# ============================================================================
# 17. TEST INVALID PRODUCT ID (Should Fail)
# ============================================================================
echo "17. Testing Invalid Product ID Validation (Should Fail)..."
echo "Command: POST /waitlist with invalid product ID"
echo ""
curl -s -X POST "$API_URL/waitlist" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "productId": "invalid@product#id"
  }' | python -m json.tool
echo ""
echo ""

# ============================================================================
# 18. DELETE CUSTOMER
# ============================================================================
if [ ! -z "$CUSTOMER_2_ID" ]; then
  echo "18. Deleting Customer 2..."
  echo "Command: DELETE /waitlist/$CUSTOMER_2_ID"
  echo ""
  curl -s -X DELETE "$API_URL/waitlist/$CUSTOMER_2_ID" | python -m json.tool
  echo ""
  echo ""
fi

# ============================================================================
# 19. FINAL STATISTICS
# ============================================================================
echo "19. Final Waitlist Statistics..."
echo "Command: GET /waitlist/stats/summary"
echo ""
curl -s "$API_URL/waitlist/stats/summary" | python -m json.tool
echo ""
echo ""

# ============================================================================
# 20. FINAL WAITLIST STATE
# ============================================================================
echo "20. Final Waitlist State..."
echo "Command: GET /waitlist"
echo ""
curl -s "$API_URL/waitlist" | python -m json.tool
echo ""
echo ""

echo "============================================================"
echo "✓ Testing Complete!"
echo "============================================================"
echo ""
echo "Summary of tests:"
echo "  ✓ Health check"
echo "  ✓ Create entries"
echo "  ✓ Read entries (all and single)"
echo "  ✓ Update status"
echo "  ✓ Delete entries"
echo "  ✓ Filtering by status and product ID"
echo "  ✓ Pagination"
echo "  ✓ Statistics"
echo "  ✓ Validation (email, product ID, duplicates)"
echo ""
echo "Frontend Dashboard:"
echo "  → Visit http://localhost:3000"
echo "  → All changes should appear in real-time"
echo ""

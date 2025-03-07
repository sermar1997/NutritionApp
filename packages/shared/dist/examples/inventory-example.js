/**
 * Example usage of the Inventory module
 *
 * This file demonstrates how to use the Inventory service with the new architecture.
 * It's purely for demonstration purposes and is not part of the production codebase.
 */
import container, { ServiceTokens } from '../core/di/container';
import { StorageLocation } from '../core/models/inventory';
/**
 * Run the example that demonstrates inventory operations
 */
async function runInventoryExample() {
    console.log('📦 Inventory Module Example');
    console.log('===========================');
    // Get the inventory service from the container
    const inventoryService = container.resolve(ServiceTokens.InventoryService);
    // Add some sample items
    console.log('\n➕ Adding sample inventory items...');
    const items = [
        {
            name: 'Apples',
            quantity: 5,
            unit: 'pieces',
            category: 'Fruits',
            locationId: StorageLocation.REFRIGERATOR,
            expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            isStaple: false,
            purchasePrice: 2.99
        },
        {
            name: 'Milk',
            quantity: 1,
            unit: 'liter',
            category: 'Dairy',
            locationId: StorageLocation.REFRIGERATOR,
            expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            isStaple: true,
            lowStockThreshold: 1,
            purchasePrice: 1.99
        },
        {
            name: 'Rice',
            quantity: 2,
            unit: 'kg',
            category: 'Grains',
            locationId: StorageLocation.PANTRY,
            expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            isStaple: true,
            lowStockThreshold: 1,
            purchasePrice: 3.49
        }
    ];
    // Add each item
    for (const item of items) {
        await inventoryService.addItem(item);
        console.log(`Added: ${item.name} (${item.quantity} ${item.unit})`);
    }
    // Get all inventory items
    console.log('\n📋 Current inventory:');
    const allItems = await inventoryService.getAllItems();
    allItems.forEach(item => {
        console.log(`- ${item.name}: ${item.quantity} ${item.unit} (${StorageLocation[item.locationId]})`);
    });
    // Get items by location
    console.log('\n🧊 Items in refrigerator:');
    const refrigeratorItems = await inventoryService.getItemsByLocation(StorageLocation.REFRIGERATOR);
    refrigeratorItems.forEach(item => {
        console.log(`- ${item.name}: ${item.quantity} ${item.unit}`);
    });
    // Calculate inventory stats
    console.log('\n📊 Inventory statistics:');
    const stats = await inventoryService.calculateInventoryStats();
    console.log(`Total items: ${stats.totalItems}`);
    console.log(`Expiring within 7 days: ${stats.expiringWithin7Days}`);
    console.log(`Low stock items: ${stats.lowStockItems}`);
    console.log(`Total value: $${stats.totalValue.toFixed(2)}`);
    // Get expiring items
    console.log('\n⏰ Items expiring within 7 days:');
    const expiringItems = await inventoryService.getExpiringItems(7);
    expiringItems.forEach(item => {
        const expiryDate = new Date(item.expirationDate);
        console.log(`- ${item.name}: expires on ${expiryDate.toLocaleDateString()}`);
    });
    // Generate alerts
    console.log('\n🚨 Inventory alerts:');
    const alerts = await inventoryService.generateAlerts();
    alerts.forEach(alert => {
        console.log(`- ${alert.alertType}: ${alert.message}`);
    });
    // Sort inventory items by name
    console.log('\n🔤 Inventory sorted by name:');
    const sortedByName = await inventoryService.sortItems('name', true);
    sortedByName.forEach(item => {
        console.log(`- ${item.name}`);
    });
    // Search for items
    const searchTerm = 'Apple';
    console.log(`\n🔍 Searching for "${searchTerm}":"`);
    const searchResults = await inventoryService.searchItems(searchTerm);
    if (searchResults.length > 0) {
        searchResults.forEach(item => {
            console.log(`- ${item.name}: ${item.quantity} ${item.unit}`);
        });
    }
    else {
        console.log('No items found matching the search term.');
    }
    // Generate shopping list
    console.log('\n🛒 Generated shopping list:');
    const shoppingList = await inventoryService.generateShoppingList(true, true);
    if (shoppingList.length > 0) {
        shoppingList.forEach(item => {
            console.log(`- ${item.name}: ${item.quantity} ${item.unit}`);
        });
    }
    else {
        console.log('No items needed for shopping list.');
    }
    console.log('\n✅ Example completed!');
}
// Export the example function
export default runInventoryExample;
